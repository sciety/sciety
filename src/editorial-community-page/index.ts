import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import createGetReviewedArticlesFromReviewReferences from './get-reviewed-articles-from-review-references';
import createRenderEndorsedArticles, { GetEndorsedArticles, RenderEndorsedArticles } from './render-endorsed-articles';
import createRenderPage, { FetchArticle } from './render-page';
import createRenderPageHeader, { GetEditorialCommunity, RenderPageHeader } from './render-page-header';
import createRenderReviewedArticles, { RenderReviewedArticles } from './render-reviewed-articles';
import Doi from '../types/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { FetchExternalArticle } from '../types/fetch-external-article';
import ReviewReferenceRepository from '../types/review-reference-repository';

interface Ports {
  fetchArticle: FetchExternalArticle;
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  reviewReferenceRepository: ReviewReferenceRepository;
}

const raiseFetchArticleErrors = (fetchArticle: FetchExternalArticle): FetchArticle => (
  async (doi) => {
    const result = await fetchArticle(doi);
    return result.unsafelyUnwrap();
  }
);

const buildRenderPageHeader = (editorialCommunities: EditorialCommunityRepository): RenderPageHeader => {
  const getEditorialCommunity: GetEditorialCommunity = async (editorialCommunityId) => {
    const editorialCommunity = (await editorialCommunities.lookup(editorialCommunityId))
      .unwrapOrElse(() => {
        throw new NotFound(`${editorialCommunityId} not found`);
      });
    return editorialCommunity;
  };
  return createRenderPageHeader(getEditorialCommunity);
};

type GetArticleTitle = (doi: Doi) => Promise<string>;

const buildRenderEndorsedArticles = (
  endorsements: EndorsementsRepository,
  fetchArticle: FetchArticle,
): RenderEndorsedArticles => {
  const getArticleTitle: GetArticleTitle = async (articleDoi) => {
    const article = await fetchArticle(articleDoi);
    return article.title;
  };
  const getEndorsedArticles: GetEndorsedArticles = async (editorialCommunityId) => {
    const articleDois = await endorsements.endorsedBy(editorialCommunityId);
    return Promise.all(articleDois.map(async (articleDoi) => (
      {
        doi: articleDoi,
        title: await getArticleTitle(articleDoi),
      }
    )));
  };
  return createRenderEndorsedArticles(getEndorsedArticles);
};

const buildRenderReviewedArticles = (
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
): RenderReviewedArticles => {
  const getReviewedArticles = createGetReviewedArticlesFromReviewReferences(
    reviewReferenceRepository.findReviewsForEditorialCommunityId,
    fetchArticle,
  );
  return createRenderReviewedArticles(getReviewedArticles);
};

export default (ports: Ports): Middleware => {
  const fetchArticle = raiseFetchArticleErrors(ports.fetchArticle);
  const renderPageHeader = buildRenderPageHeader(ports.editorialCommunities);
  const renderEndorsedArticles = buildRenderEndorsedArticles(ports.endorsements, fetchArticle);
  const renderReviewedArticles = buildRenderReviewedArticles(fetchArticle, ports.reviewReferenceRepository);

  const renderPage = createRenderPage(
    renderPageHeader,
    renderEndorsedArticles,
    renderReviewedArticles,
  );

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.params.id);
    await next();
  };
};

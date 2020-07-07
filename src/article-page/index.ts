import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import createRenderAddReviewForm, { GetAllEditorialCommunities, RenderAddReviewForm } from './render-add-review-form';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderPage from './render-page';
import createRenderPageHeader, {
  GetArticleDetails,
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderPageHeader,
} from './render-page-header';
import createRenderReview, { GetEditorialCommunityName as GetEditorialCommunityNameForRenderReview } from './render-review';
import createRenderReviews, { RenderReviews } from './render-reviews';
import validateBiorxivDoi from './validate-biorxiv-doi';
import { endorsingEditorialCommunityIds } from '../infrastructure/in-memory-endorsements-repository';
import { Adapters } from '../types/adapters';
import Doi from '../types/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

const reviewsId = 'reviews';

type GetFullArticle = (doi: Doi) => Promise<{
  abstract: string;
}>;

type GetEditorialCommunityName = (editorialCommunityId: string) => Promise<string>;

const handleFetchArticleErrors = (fetchArticle: Adapters['fetchArticle']): GetArticleDetails & GetFullArticle => (
  async (doi: Doi) => {
    const result = await fetchArticle(doi);

    return result.unwrapOrElse(() => {
      throw new NotFound(`${doi} not found`);
    });
  }
);

const buildRenderPageHeader = (adapters: Adapters): RenderPageHeader => {
  const getArticleDetailsAdapter: GetArticleDetails = handleFetchArticleErrors(adapters.fetchArticle);
  const reviewCountAdapter: GetReviewCount = async (articleDoi) => (
    (await adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi)).length
  );
  const getEditorialCommunityName: GetEditorialCommunityName = async (editorialCommunityId) => (
    (await adapters.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap().name
  );
  const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async (doi) => (
    Promise.all((await endorsingEditorialCommunityIds(doi)).map(getEditorialCommunityName))
  );
  return createRenderPageHeader(
    getArticleDetailsAdapter,
    reviewCountAdapter,
    adapters.getBiorxivCommentCount,
    getEndorsingEditorialCommunityNames,
    `#${reviewsId}`,
  );
};

const buildRenderAbstract = (fetchAbstract: GetFullArticle): RenderArticleAbstract => {
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi);
    return { content: fetchedArticle.abstract };
  };
  return createRenderArticleAbstract(abstractAdapter);
};

const buildRenderAddReviewForm = (editorialCommunities: EditorialCommunityRepository): RenderAddReviewForm => {
  const editorialCommunitiesAdapter: GetAllEditorialCommunities = async () => editorialCommunities.all();
  return createRenderAddReviewForm(editorialCommunitiesAdapter);
};

const buildRenderReviews = (adapters: Adapters): RenderReviews => {
  const getEditorialCommunityName: GetEditorialCommunityNameForRenderReview = async (editorialCommunityId) => (
    (await adapters.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap().name
  );

  const renderReview = createRenderReview(adapters.fetchReview, getEditorialCommunityName, 1500);
  return createRenderReviews(
    renderReview,
    adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi,
    reviewsId,
  );
};

export default (adapters: Adapters): Middleware => {
  const renderPageHeader = buildRenderPageHeader(adapters);
  const renderAbstract = buildRenderAbstract(handleFetchArticleErrors(adapters.fetchArticle));
  const renderAddReviewForm = buildRenderAddReviewForm(adapters.editorialCommunities);
  const renderReviews = buildRenderReviews(adapters);
  const renderPage = createRenderPage(
    renderPageHeader,
    renderReviews,
    renderAbstract,
    renderAddReviewForm,
  );
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi = validateBiorxivDoi(ctx.params.doi);

    ctx.response.body = await renderPage(doi);

    await next();
  };
};

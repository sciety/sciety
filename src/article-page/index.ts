import { Middleware, RouterContext } from '@koa/router';
import { NotFound, ServiceUnavailable } from 'http-errors';
import { Next } from 'koa';
import createFetchReviews from './fetch-reviews';
import createRenderAddReviewForm, { GetAllEditorialCommunities, RenderAddReviewForm } from './render-add-review-form';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderPage from './render-page';
import createRenderPageHeader, {
  GetArticleDetails,
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderPageHeader,
} from './render-page-header';
import createRenderReviews, { GetReviews, RenderReviews } from './render-reviews';
import validateBiorxivDoi from './validate-biorxiv-doi';
import endorsements from '../bootstrap-endorsements';
import { FetchDatasetError } from '../infrastructure/fetch-dataset';
import { Adapters } from '../types/adapters';
import Doi from '../types/doi';
import EditorialCommunityRepository from '../types/editorial-community-repository';

const reviewsId = 'reviews';

type GetFullArticle = (doi: Doi) => Promise<{
  abstract: string;
}>;

type GetEditorialCommunityName = (editorialCommunityId: string) => Promise<string>;

const buildRenderPageHeader = (adapters: Adapters): RenderPageHeader => {
  const getArticleDetailsAdapter: GetArticleDetails = async (articleDoi) => (
    adapters.fetchArticle(articleDoi)
      .catch(() => {
        throw new NotFound(`${articleDoi} not found`);
      })
  );
  const reviewCountAdapter: GetReviewCount = async (articleDoi) => (
    (await adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi)).length
  );
  const createGetEndorsingEditorialCommunityNames = (
    getEditorialCommunityName: GetEditorialCommunityName,
  ): GetEndorsingEditorialCommunityNames => (
    async (doi) => {
      const endorsingEditorialCommunityIds = endorsements[doi.value] ?? [];
      return Promise.all(endorsingEditorialCommunityIds.map(getEditorialCommunityName));
    }
  );
  const getEditorialCommunityName: GetEditorialCommunityName = async (editorialCommunityId) => (
    adapters.editorialCommunities.lookup(editorialCommunityId).name
  );
  return createRenderPageHeader(
    getArticleDetailsAdapter,
    reviewCountAdapter,
    adapters.getBiorxivCommentCount,
    createGetEndorsingEditorialCommunityNames(getEditorialCommunityName),
    `#${reviewsId}`,
  );
};

const buildRenderAbstract = (fetchAbstract: GetFullArticle): RenderArticleAbstract => {
  const abstractAdapter: GetArticleAbstract = async (articleDoi) => {
    const fetchedArticle = await fetchAbstract(articleDoi)
      .catch(() => {
        throw new NotFound(`${articleDoi} not found`);
      });
    return { content: fetchedArticle.abstract };
  };
  return createRenderArticleAbstract(abstractAdapter);
};

const buildRenderAddReviewForm = (editorialCommunities: EditorialCommunityRepository): RenderAddReviewForm => {
  const editorialCommunitiesAdapter: GetAllEditorialCommunities = async () => editorialCommunities.all();
  return createRenderAddReviewForm(editorialCommunitiesAdapter);
};

const buildRenderReviews = (adapters: Adapters): RenderReviews => {
  const fetchReviews = createFetchReviews(
    adapters.reviewReferenceRepository,
    adapters.fetchReview,
    adapters.editorialCommunities,
  );
  const reviewsAdapter: GetReviews = async (articleDoi) => (
    fetchReviews(articleDoi)
      .catch((error) => {
        if (error instanceof FetchDatasetError) {
          throw new ServiceUnavailable('Article temporarily unavailable. Please try refreshing.');
        }
        throw new NotFound(`${articleDoi} not found`);
      })
  );
  return createRenderReviews(reviewsAdapter, reviewsId);
};

export default (adapters: Adapters): Middleware => {
  const renderPageHeader = buildRenderPageHeader(adapters);
  const renderAbstract = buildRenderAbstract(adapters.fetchArticle);
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

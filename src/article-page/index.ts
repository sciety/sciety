import { Middleware, RouterContext } from '@koa/router';
import { NotFound, ServiceUnavailable } from 'http-errors';
import { Next } from 'koa';
import createFetchReviews from './fetch-reviews';
import createRenderAddReviewForm, { GetAllEditorialCommunities, RenderAddReviewForm } from './render-add-review-form';
import createRenderArticleAbstract, { GetArticleAbstract, RenderArticleAbstract } from './render-article-abstract';
import createRenderPage from './render-page';
import createRenderReviews, { GetReviews, RenderReviews } from './render-reviews';
import validateBiorxivDoi from './validate-biorxiv-doi';
import { FetchDatasetError } from '../api/fetch-dataset';
import Doi from '../data/doi';
import { Adapters } from '../types/adapters';
import EditorialCommunityRepository from '../types/editorial-community-repository';

const reviewsId = 'reviews';

type GetFullArticle = (doi: Doi) => Promise<{
  abstract: string;
}>;

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
  const renderAbstract = buildRenderAbstract(adapters.fetchArticle);
  const renderAddReviewForm = buildRenderAddReviewForm(adapters.editorialCommunities);
  const renderReviews = buildRenderReviews(adapters);
  const renderPage = createRenderPage(
    renderReviews,
    adapters.editorialCommunities,
    adapters.getBiorxivCommentCount,
    adapters.fetchArticle,
    renderAbstract,
    adapters.reviewReferenceRepository,
    renderAddReviewForm,
  );
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi = validateBiorxivDoi(ctx.params.doi);
    ctx.response.body = await renderPage(doi);
    await next();
  };
};

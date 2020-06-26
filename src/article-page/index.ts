import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createFetchReviews from './fetch-reviews';
import createRenderPage from './render-page';
import validateBiorxivDoi from './validate-biorxiv-doi';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const fetchReviews = createFetchReviews(
    adapters.reviewReferenceRepository,
    adapters.fetchReview,
    adapters.editorialCommunities,
  );
  const renderPage = createRenderPage(
    fetchReviews,
    adapters.editorialCommunities,
    adapters.getBiorxivCommentCount,
    adapters.fetchArticle,
    adapters.fetchArticle,
    adapters.reviewReferenceRepository,
  );
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi = validateBiorxivDoi(ctx.params.doi);
    ctx.response.body = await renderPage(doi);
    await next();
  };
};

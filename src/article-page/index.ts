import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import createFetchReviews from './fetch-reviews';
import renderPage from './render-page';
import validateBiorxivDoi from './validate-biorxiv-doi';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const fetchReviews = createFetchReviews(
    adapters.reviewReferenceRepository,
    adapters.fetchReview,
    adapters.editorialCommunities,
  );
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi = validateBiorxivDoi(ctx.params.doi);
    ctx.response.body = await renderPage(
      doi,
      fetchReviews,
      adapters.editorialCommunities,
      adapters.getBiorxivCommentCount,
      adapters.fetchArticle,
      adapters.fetchArticle,
      adapters.reviewReferenceRepository,
    );
    await next();
  };
};

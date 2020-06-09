import { Middleware } from 'koa';
import createRenderSearchResults from './render-search-results';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const renderSearchResults = createRenderSearchResults(
    adapters.getJson,
    adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi,
  );
  return async (ctx, next) => {
    ctx.response.body = `
      <h1 class="header">Search results</h1>
      ${await renderSearchResults(ctx.request.query.query)}
    `;

    await next();
  };
};

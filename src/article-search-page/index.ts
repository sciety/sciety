import { Middleware } from 'koa';
import createRenderPage from './render-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const renderPage = createRenderPage(
    adapters.getJson,
    adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage(ctx.request.query.query);
    await next();
  };
};

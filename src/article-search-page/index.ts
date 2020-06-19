import { Middleware } from 'koa';
import createRenderPage, { GetReviewCount } from './render-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const getReviewCount: GetReviewCount = async (doi) => (
    adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi(doi).length
  );
  const renderPage = createRenderPage(
    adapters.getJson,
    adapters.getBiorxivCommentCount,
    getReviewCount,
    adapters.editorialCommunities.lookup,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage(ctx.request.query.query);
    await next();
  };
};

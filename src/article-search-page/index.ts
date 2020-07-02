import { Middleware } from 'koa';
import { Maybe } from 'true-myth';
import createRenderPage, { GetReviewCount } from './render-page';
import { Adapters } from '../types/adapters';
import GetCommentCountError from '../types/get-comment-count-error';

export default (adapters: Adapters): Middleware => {
  const getReviewCount: GetReviewCount = async (doi) => (
    (await adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi(doi)).length
  );
  const renderPage = createRenderPage(
    adapters.getJson,
    async (doi) => {
      try {
        return Maybe.just(await adapters.getBiorxivCommentCount(doi));
      } catch (e) {
        if (e instanceof GetCommentCountError) {
          return Maybe.nothing();
        }
        throw e;
      }
    },
    getReviewCount,
    adapters.editorialCommunities.lookup,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage(ctx.request.query.query);
    await next();
  };
};

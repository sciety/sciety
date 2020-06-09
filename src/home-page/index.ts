import { Middleware } from '@koa/router';
import { GetEditorialCommunities, GetReviewReferences } from './render-most-recent-reviews';
import createRenderPage from './render-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const reviewReferenceAdapter: GetReviewReferences = async () => Array.from(adapters.reviewReferenceRepository);
  const editorialCommunitiesAdapter: GetEditorialCommunities = async () => adapters.editorialCommunities.all();
  const renderPage = createRenderPage(
    reviewReferenceAdapter,
    adapters.fetchArticle,
    editorialCommunitiesAdapter,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage();
    await next();
  };
};

import { Middleware } from '@koa/router';
import createRenderEditorialCommunities from './render-editorial-communities';
import createRenderFindArticle from './render-find-article';
import createMostRecentReviews, { ReviewReference } from './render-most-recent-reviews';
import createRenderPage from './render-page';
import createRenderPageHeader from './render-page-header';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const reviewReferenceAdapter = async (): Promise<Array<ReviewReference>> => (
    Array.from(adapters.reviewReferenceRepository)
  );
  const editorialCommunitiesAdapter = async (): Promise<Array<{ id: string; name: string }>> => (
    adapters.editorialCommunities.all()
  );
  const renderPage = createRenderPage(
    createRenderPageHeader(),
    createMostRecentReviews(reviewReferenceAdapter, adapters.fetchArticle, editorialCommunitiesAdapter),
    createRenderEditorialCommunities(editorialCommunitiesAdapter),
    createRenderFindArticle(),
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage();
    await next();
  };
};

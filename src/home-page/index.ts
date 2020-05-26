import { Middleware } from '@koa/router';
import renderHomePage from './render-home-page';
import createMostRecentReviews, { ReviewReference } from './render-most-recent-reviews';
import createRenderPageHeader from './render-page-header';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const reviewReferenceAdapter = async (): Promise<Array<ReviewReference>> => (
    Array.from(adapters.reviewReferenceRepository)
  );
  const editorialCommunitiesAdapter = async (): Promise<Array<{ id: string; name: string }>> => (
    adapters.editorialCommunities.all()
  );
  return renderHomePage(
    editorialCommunitiesAdapter,
    createRenderPageHeader(),
    createMostRecentReviews(reviewReferenceAdapter, adapters.fetchArticle, editorialCommunitiesAdapter),
  );
};

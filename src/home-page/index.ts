import { Middleware } from '@koa/router';
import renderHomePage, { ReviewReference } from './render-home-page';
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
    reviewReferenceAdapter,
    adapters.fetchArticle,
  );
};

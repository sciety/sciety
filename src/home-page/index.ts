import { Middleware } from '@koa/router';
import renderHomePage, { ReviewReference } from './render-home-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => {
  const reviewReferenceAdapter = (): Array<ReviewReference> => Array.from(adapters.reviewReferenceRepository);
  return renderHomePage(
    adapters.editorialCommunities.all,
    reviewReferenceAdapter,
    adapters.fetchArticle,
  );
};

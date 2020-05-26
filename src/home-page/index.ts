import { Middleware } from '@koa/router';
import renderHomePage from './render-home-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  renderHomePage(adapters.editorialCommunities, adapters.reviewReferenceRepository, adapters.fetchArticle)
);

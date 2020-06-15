import { Middleware } from '@koa/router';
import renderEditorialCommunityPage from './middleware/render-editorial-community-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  renderEditorialCommunityPage(
    adapters.editorialCommunities,
    adapters.fetchArticle,
    adapters.reviewReferenceRepository,
  )
);

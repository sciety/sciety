import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import lookupEditorialCommunity from './middleware/lookup-editorial-community';
import renderEditorialCommunityPage from './middleware/render-editorial-community-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    lookupEditorialCommunity(adapters.editorialCommunities),
    renderEditorialCommunityPage(
      adapters.editorialCommunities,
      adapters.fetchArticle,
      adapters.reviewReferenceRepository,
    ),
  ])
);

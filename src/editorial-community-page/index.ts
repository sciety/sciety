import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import fetchReviewedArticles from './middleware/fetch-reviewed-articles';
import lookupEditorialCommunity from './middleware/lookup-editorial-community';
import lookupReviewedArticles from './middleware/lookup-reviewed-articles';
import renderEditorialCommunityPage from './middleware/render-editorial-community-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    lookupEditorialCommunity(adapters.editorialCommunities),
    lookupReviewedArticles(adapters.reviewReferenceRepository),
    fetchReviewedArticles(adapters.fetchArticle),
    renderEditorialCommunityPage(adapters.editorialCommunities),
  ])
);

import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import constructViewModel from './construct-view-model';
import fetchReviewedArticles from './fetch-reviewed-articles';
import lookupEditorialCommunity from './lookup-editorial-community';
import lookupReviewedArticles from './lookup-reviewed-articles';
import renderEditorialCommunityPage from './render-editorial-community-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    lookupEditorialCommunity(adapters.editorialCommunities),
    lookupReviewedArticles(adapters.reviewReferenceRepository),
    fetchReviewedArticles(adapters.fetchArticle),
    constructViewModel(),
    renderEditorialCommunityPage(),
  ])
);

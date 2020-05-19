import { Middleware } from '@koa/router';
import compose from 'koa-compose';
import constructViewModel from './construct-view-model';
import fetchArticles from './fetch-articles';
import lookupMostRecentReviews from './lookup-most-recent-reviews';
import populateEditorialCommunities from './populate-editorial-communities';
import renderHomePage from './render-home-page';
import { Adapters } from '../types/adapters';

export default (adapters: Adapters): Middleware => (
  compose([
    lookupMostRecentReviews(),
    fetchArticles(adapters.fetchArticle),
    populateEditorialCommunities(adapters.editorialCommunities),
    constructViewModel(),
    renderHomePage(adapters.editorialCommunities),
  ])
);

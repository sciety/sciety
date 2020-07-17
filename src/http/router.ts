import Router from '@koa/router';
import addPageTemplate from './add-page-template';
import pageHandler from './page-handler';
import ping from './ping';
import robots from './robots';
import createAboutPage from '../about-page';
import createArticlePage from '../article-page';
import createArticleSearchPage from '../article-search-page';
import createEditorialCommunityPage from '../editorial-community-page';
import createHomePage from '../home-page';
import { Adapters } from '../infrastructure/adapters';

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    pageHandler(adapters, createHomePage),
    addPageTemplate());

  router.get('/about',
    createAboutPage(adapters),
    addPageTemplate());

  router.get('/articles',
    createArticleSearchPage(adapters),
    addPageTemplate());

  router.get('/articles/:doi(.+)',
    createArticlePage(adapters),
    addPageTemplate());

  router.get('/editorial-communities/:id',
    createEditorialCommunityPage(adapters),
    addPageTemplate());

  router.get('/robots.txt',
    robots());

  return router;
};

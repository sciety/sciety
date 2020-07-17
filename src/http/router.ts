import Router from '@koa/router';
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
    pageHandler(createHomePage(adapters)));

  router.get('/about',
    pageHandler(createAboutPage(adapters)));

  router.get('/articles',
    pageHandler(createArticleSearchPage(adapters)));

  router.get('/articles/:doi(.+)',
    pageHandler(createArticlePage(adapters)));

  router.get('/editorial-communities/:id',
    pageHandler(createEditorialCommunityPage(adapters)));

  router.get('/robots.txt',
    robots());

  return router;
};

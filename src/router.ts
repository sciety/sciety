import Router from '@koa/router';
import createAboutPage from './about-page';
import createAddArticleResponse from './add-article';
import createArticlePage from './article-page';
import createArticleSearchPage from './article-search-page';
import createEditorialCommunityPage from './editorial-community-page';
import ping from './handlers/ping';
import robots from './handlers/robots';
import createHomePage from './home-page';
import { Adapters } from './infrastructure/adapters';
import addPageTemplate from './middleware/add-page-template';

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    createHomePage(adapters),
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

  router.post('/reviews',
    createAddArticleResponse(adapters));

  router.get('/robots.txt',
    robots());

  return router;
};

import Router from '@koa/router';
import createAboutPage from './about-page';
import createAddArticleResponse from './add-article';
import createArticlePage from './article-page';
import createEditorialCommunityPage from './editorial-community-page';
import ping from './handlers/ping';
import createHomePage from './home-page';
import addPageTemplate from './middleware/add-page-template';
import { Adapters } from './types/adapters';

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    createHomePage(adapters),
    addPageTemplate());

  router.get('/about',
    createAboutPage(),
    addPageTemplate());

  router.get('/articles/:doi(.+)',
    createArticlePage(adapters),
    addPageTemplate());

  router.get('/editorial-communities/:id',
    createEditorialCommunityPage(adapters),
    addPageTemplate());

  router.post('/reviews',
    createAddArticleResponse(adapters));

  return router;
};

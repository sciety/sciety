import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import createArticlePage from './article-page';
import createEditorialCommunityPage from './editorial-community-page';
import ping from './handlers/ping';
import reviews from './handlers/reviews';
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

  router.get('/articles/:doi(.+)',
    createArticlePage(adapters),
    addPageTemplate());

  router.get('/editorial-communities/:id',
    createEditorialCommunityPage(adapters),
    addPageTemplate());

  router.post('/reviews',
    bodyParser({ enableTypes: ['form'] }),
    reviews(adapters.reviewReferenceRepository, adapters.editorialCommunities));

  return router;
};

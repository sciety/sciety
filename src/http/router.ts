import path from 'path';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import identifyUser from './identify-user';
import pageHandler from './page-handler';
import ping from './ping';
import readWriteFollowList from './read-write-follow-list';
import robots from './robots';
import createAboutPage from '../about-page';
import createArticlePage from '../article-page';
import createArticleSearchPage from '../article-search-page';
import createEditorialCommunityPage from '../editorial-community-page';
import createFollowHandler from '../follow/follow-handler';
import createHomePage from '../home-page';
import { Adapters } from '../infrastructure/adapters';
import createUnfollowHandler from '../unfollow/unfollow-handler';
import createUserPage from '../user-page';

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    identifyUser(adapters.logger),
    readWriteFollowList(),
    pageHandler(createHomePage(adapters)));

  router.get('/about',
    identifyUser(adapters.logger),
    readWriteFollowList(),
    pageHandler(createAboutPage(adapters)));

  router.get('/users/:userId(.+)',
    identifyUser(adapters.logger),
    readWriteFollowList(),
    pageHandler(createUserPage(adapters)));

  router.get('/articles',
    identifyUser(adapters.logger),
    readWriteFollowList(),
    pageHandler(createArticleSearchPage(adapters)));

  router.get('/articles/:doi(.+)',
    identifyUser(adapters.logger),
    readWriteFollowList(),
    pageHandler(createArticlePage(adapters)));

  router.get('/editorial-communities/:id',
    identifyUser(adapters.logger),
    readWriteFollowList(),
    pageHandler(createEditorialCommunityPage(adapters)));

  router.post('/follow',
    readWriteFollowList(),
    bodyParser({ enableTypes: ['form'] }),
    createFollowHandler(adapters));

  router.post('/unfollow',
    readWriteFollowList(),
    bodyParser({ enableTypes: ['form'] }),
    createUnfollowHandler(adapters));

  router.get('/robots.txt',
    robots());

  router.get('/static/:file(.+)', async (context) => {
    try {
      await send(context, context.params.file, { root: path.resolve(__dirname, '../../static') });
    } catch (error) {
      if (error.status && error.status === 404) {
        context.response.status = 404;
        return;
      }
      throw error;
    }
  });

  return router;
};

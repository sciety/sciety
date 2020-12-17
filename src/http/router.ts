import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import koaPassport from 'koa-passport';
import { catchErrors } from './catch-errors';
import { catchStaticFileErrors } from './catch-static-file-errors';
import identifyUser from './identify-user';
import { loadStaticFile } from './load-static-file';
import pageHandler from './page-handler';
import ping from './ping';
import { createRedirectAfterAuthenticating, createRequireAuthentication } from './require-authentication';
import robots from './robots';
import createAboutPage from '../about-page';
import createArticlePage from '../article-page';
import createArticleSearchPage from '../article-search-page';
import createEditorialCommunityPage from '../editorial-community-page';
import createFollowHandler from '../follow';
import createFinishFollowCommand from '../follow/finish-follow-command';
import createSaveFollowCommand from '../follow/save-follow-command';
import createHomePage from '../home-page';
import { Adapters } from '../infrastructure/adapters';
import createCommunityOutreachManagerPage from '../jobs/community-outreach-manager-page';
import createLogOutHandler from '../log-out';
import createPrivacyPage from '../privacy-page';
import { createRespondHandler } from '../respond';
import { finishRespondCommand } from '../respond/finish-respond-command';
import { saveRespondCommand } from '../respond/save-respond-command';
import createTermsPage from '../terms-page';
import createUnfollowHandler from '../unfollow';
import createFinishUnfollowCommand from '../unfollow/finish-unfollow-command';
import createSaveUnfollowCommand from '../unfollow/save-unfollow-command';
import createUserPage from '../user-page';

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    identifyUser(adapters.logger),
    pageHandler(createHomePage(adapters)));

  router.get('/about',
    identifyUser(adapters.logger),
    pageHandler(createAboutPage(adapters)));

  router.get('/users/:id(.+)',
    identifyUser(adapters.logger),
    pageHandler(createUserPage(adapters)));

  router.get('/articles',
    identifyUser(adapters.logger),
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(createArticleSearchPage(adapters)));

  router.get('/articles/:doi(.+)',
    identifyUser(adapters.logger),
    pageHandler(createArticlePage(adapters)));

  router.get('/editorial-communities/:id',
    identifyUser(adapters.logger),
    pageHandler(createEditorialCommunityPage(adapters)));

  router.post('/follow',
    identifyUser(adapters.logger),
    bodyParser({ enableTypes: ['form'] }),
    createSaveFollowCommand(),
    createRequireAuthentication(),
    createFollowHandler(adapters));

  router.post('/unfollow',
    identifyUser(adapters.logger),
    bodyParser({ enableTypes: ['form'] }),
    createSaveUnfollowCommand(),
    createRequireAuthentication(),
    createUnfollowHandler(adapters));

  router.post('/respond',
    identifyUser(adapters.logger),
    bodyParser({ enableTypes: ['form'] }),
    saveRespondCommand,
    createRequireAuthentication(),
    createRespondHandler(adapters));

  const authenticate = koaPassport.authenticate(
    'twitter',
    {
      failureRedirect: '/',
    },
  );

  router.get('/log-in',
    authenticate);

  router.get('/log-out',
    createLogOutHandler());

  router.get('/twitter/callback',
    catchErrors(
      adapters.logger,
      'Detected Twitter callback error',
      'Something went wrong, please try again.',
    ),
    authenticate,
    createFinishFollowCommand(adapters),
    createFinishUnfollowCommand(adapters),
    finishRespondCommand(),
    createRedirectAfterAuthenticating());

  router.get('/privacy',
    identifyUser(adapters.logger),
    pageHandler(createPrivacyPage()));

  router.get('/terms',
    identifyUser(adapters.logger),
    pageHandler(createTermsPage()));

  router.get('/jobs/community-outreach-manager',
    identifyUser(adapters.logger),
    pageHandler(createCommunityOutreachManagerPage(adapters)));

  router.get('/robots.txt',
    robots());

  router.get('/static/:file(.+)',
    catchStaticFileErrors(adapters.logger),
    loadStaticFile);

  return router;
};

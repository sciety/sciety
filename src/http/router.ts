import Router from '@koa/router';
import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import bodyParser from 'koa-bodyparser';
import { authenticate } from './authenticate';
import { catchErrors } from './catch-errors';
import { catchStaticFileErrors } from './catch-static-file-errors';
import { loadStaticFile } from './load-static-file';
import { logOut } from './log-out';
import { pageHandler } from './page-handler';
import { ping } from './ping';
import { redirectBack } from './redirect-back';
import { redirectAfterAuthenticating, requireAuthentication } from './require-authentication';
import { robots } from './robots';
import { aboutPage } from '../about-page';
import { articlePage } from '../article-page';
import { articleSearchPage } from '../article-search-page';
import editorialCommunityPage from '../editorial-community-page';
import { followHandler } from '../follow';
import { finishFollowCommand } from '../follow/finish-follow-command';
import { saveFollowCommand } from '../follow/save-follow-command';
import { homePage } from '../home-page';
import { Adapters } from '../infrastructure/adapters';
import { privacyPage } from '../privacy-page';
import { respondHandler } from '../respond';
import { finishRespondCommand } from '../respond/finish-respond-command';
import { saveRespondCommand } from '../respond/save-respond-command';
import { finishSaveArticleCommand } from '../save-article/finish-save-article-command';
import { saveSaveArticleCommand } from '../save-article/save-save-article-command';
import { termsPage } from '../terms-page';
import { unfollowHandler } from '../unfollow';
import { finishUnfollowCommand } from '../unfollow/finish-unfollow-command';
import { saveUnfollowCommand } from '../unfollow/save-unfollow-command';
import { userPage } from '../user-page';

export const createRouter = (adapters: Adapters): Router => {
  const router = new Router();

  // PAGES

  router.get('/',
    pageHandler(flow(homePage(adapters), TE.rightTask)));

  router.get('/about',
    pageHandler(flow(aboutPage(adapters), TE.rightTask)));

  router.get('/users/:id(.+)',
    pageHandler(userPage(adapters)));

  router.get('/articles',
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(articleSearchPage(adapters)));

  router.get('/articles/:doi(.+)',
    pageHandler(articlePage(adapters)));

  router.get('/editorial-communities/:id',
    pageHandler(editorialCommunityPage(adapters)));

  router.get('/privacy',
    pageHandler(flow(privacyPage(), TE.rightTask)));

  router.get('/terms',
    pageHandler(flow(termsPage(), TE.rightTask)));

  // COMMANDS

  router.post('/follow',
    bodyParser({ enableTypes: ['form'] }),
    saveFollowCommand(),
    requireAuthentication,
    followHandler(adapters));

  router.post('/unfollow',
    bodyParser({ enableTypes: ['form'] }),
    saveUnfollowCommand(),
    requireAuthentication,
    unfollowHandler(adapters));

  router.post('/respond',
    bodyParser({ enableTypes: ['form'] }),
    saveRespondCommand,
    requireAuthentication,
    respondHandler(adapters));

  router.post('/save-article',
    bodyParser({ enableTypes: ['form'] }),
    saveSaveArticleCommand,
    requireAuthentication,
    finishSaveArticleCommand(adapters),
    redirectBack);

  // AUTHENTICATION

  router.get('/log-in',
    authenticate);

  router.get('/log-out',
    logOut);

  // TODO set commands as an object on the session rather than individual properties
  router.get('/twitter/callback',
    catchErrors(
      adapters.logger,
      'Detected Twitter callback error',
      'Something went wrong, please try again.',
    ),
    authenticate,
    finishFollowCommand(adapters),
    finishUnfollowCommand(adapters),
    finishRespondCommand(adapters),
    finishSaveArticleCommand(adapters),
    redirectAfterAuthenticating());

  // MISC

  router.get('/ping',
    ping());

  router.get('/robots.txt',
    robots());

  router.get('/static/:file(.+)',
    catchStaticFileErrors(adapters.logger),
    loadStaticFile);

  return router;
};

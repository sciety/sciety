import path from 'path';
import Router, { Middleware } from '@koa/router';
import { isHttpError } from 'http-errors';
import { INTERNAL_SERVER_ERROR } from 'http-status-codes';
import bodyParser from 'koa-bodyparser';
import koaPassport from 'koa-passport';
import send from 'koa-send';
import { Maybe } from 'true-myth';
import identifyUser from './identify-user';
import pageHandler from './page-handler';
import ping from './ping';
import { renderErrorPage } from './render-error-page';
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
import createLogOutHandler from '../log-out';
import createPrivacyPage from '../privacy-page';
import { createRespondHandler } from '../respond';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import createTermsPage from '../terms-page';
import { toHtmlFragment } from '../types/html-fragment';
import createUnfollowHandler from '../unfollow';
import createFinishUnfollowCommand from '../unfollow/finish-unfollow-command';
import createSaveUnfollowCommand from '../unfollow/save-unfollow-command';
import createUserPage from '../user-page';

export default (adapters: Adapters): Router => {
  const router = new Router();

  const catchStaticFileErrors: Middleware = async (context, next) => {
    try {
      await next();
    } catch (error: unknown) {
      adapters.logger('error', 'Static file could not be read', { error });
      let pageMessage = 'Something went wrong, please try again.';
      if (isHttpError(error) && error.status === 404) {
        pageMessage = 'File not found';
        context.response.status = 404;
      } else {
        context.response.status = INTERNAL_SERVER_ERROR;
      }
      context.response.body = applyStandardPageLayout({
        title: 'Error | Sciety',
        content: renderErrorPage(toHtmlFragment(pageMessage)),
      }, Maybe.nothing());
    }
  };

  const loadStaticFile: Middleware = async (context, next) => {
    await send(context, context.params.file, { root: path.resolve(__dirname, '../../static') });
    await next();
  };

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

  const catchErrors = (logMessage: string, pageMessage: string): Middleware => (
    async (context, next) => {
      try {
        await next();
      } catch (error: unknown) {
        adapters.logger('error', logMessage, { error });

        context.response.status = INTERNAL_SERVER_ERROR;
        context.response.body = applyStandardPageLayout({
          title: 'Error | Sciety',
          content: renderErrorPage(toHtmlFragment(pageMessage)),
        }, Maybe.nothing());
      }
    }
  );

  router.get('/twitter/callback',
    catchErrors(
      'Detected Twitter callback error',
      'Something went wrong, please try again.',
    ),
    authenticate,
    createFinishFollowCommand(adapters),
    createFinishUnfollowCommand(adapters),
    createRedirectAfterAuthenticating());

  router.get('/privacy',
    identifyUser(adapters.logger),
    pageHandler(createPrivacyPage()));

  router.get('/terms',
    identifyUser(adapters.logger),
    pageHandler(createTermsPage()));

  router.get('/robots.txt',
    robots());

  router.get('/static/:file(.+)',
    catchStaticFileErrors,
    loadStaticFile);

  return router;
};

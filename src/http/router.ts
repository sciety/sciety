import Router from '@koa/router';
import * as E from 'fp-ts/lib/Either';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow } from 'fp-ts/lib/function';
import bodyParser from 'koa-bodyparser';
import koaPassport from 'koa-passport';
import { Result } from 'true-myth';
import { catchErrors } from './catch-errors';
import { catchStaticFileErrors } from './catch-static-file-errors';
import identifyUser from './identify-user';
import { loadStaticFile } from './load-static-file';
import pageHandler from './page-handler';
import ping from './ping';
import { redirectAfterAuthenticating, requireAuthentication } from './require-authentication';
import robots from './robots';
import aboutPage from '../about-page';
import articlePage from '../article-page';
import articleSearchPage from '../article-search-page';
import editorialCommunityPage from '../editorial-community-page';
import followHandler from '../follow';
import finishFollowCommand from '../follow/finish-follow-command';
import saveFollowCommand from '../follow/save-follow-command';
import homePage from '../home-page';
import { Adapters } from '../infrastructure/adapters';
import communityOutreachManagerPage from '../jobs/community-outreach-manager-page';
import logOutHandler from '../log-out';
import privacyPage from '../privacy-page';
import { respondHandler } from '../respond';
import { finishRespondCommand } from '../respond/finish-respond-command';
import { saveRespondCommand } from '../respond/save-respond-command';
import { Page } from '../shared-components/apply-standard-page-layout';
import termsPage from '../terms-page';
import Doi from '../types/doi';
import { userSavedArticle } from '../types/domain-events';
import { RenderPageError } from '../types/render-page-error';
import toUserId from '../types/user-id';
import unfollowHandler from '../unfollow';
import finishUnfollowCommand from '../unfollow/finish-unfollow-command';
import saveUnfollowCommand from '../unfollow/save-unfollow-command';
import userPage from '../user-page';

const toEither = <L = RenderPageError, R = Page>(result: Result<R, L>): E.Either<L, R> => (
  result
    .map((page) => E.right<L, R>(page))
    .unwrapOrElse((error) => E.left<L, R>(error))
);

export default (adapters: Adapters): Router => {
  const router = new Router();

  router.get('/ping',
    ping());

  router.get('/',
    identifyUser(adapters.logger),
    pageHandler(flow(homePage(adapters), TE.rightTask)));

  router.get('/about',
    identifyUser(adapters.logger),
    pageHandler(flow(aboutPage(adapters), TE.rightTask)));

  router.get('/users/:id(.+)',
    identifyUser(adapters.logger),
    pageHandler(userPage(adapters)));

  router.get('/articles',
    identifyUser(adapters.logger),
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(articleSearchPage(adapters)));

  router.get('/articles/:doi(.+)',
    identifyUser(adapters.logger),
    pageHandler(flow(articlePage(adapters), T.map(toEither))));

  router.get('/editorial-communities/:id',
    identifyUser(adapters.logger),
    pageHandler(editorialCommunityPage(adapters)));

  router.post('/follow',
    identifyUser(adapters.logger),
    bodyParser({ enableTypes: ['form'] }),
    saveFollowCommand(),
    requireAuthentication,
    followHandler(adapters));

  router.post('/unfollow',
    identifyUser(adapters.logger),
    bodyParser({ enableTypes: ['form'] }),
    saveUnfollowCommand(),
    requireAuthentication,
    unfollowHandler(adapters));

  router.post('/respond',
    identifyUser(adapters.logger),
    bodyParser({ enableTypes: ['form'] }),
    saveRespondCommand,
    requireAuthentication,
    respondHandler(adapters));

  router.post('/save-article',
    bodyParser({ enableTypes: ['form'] }),
    async (context, next) => {
      const articleId = new Doi(context.request.body.articleid);
      await adapters.commitEvents([
        userSavedArticle(toUserId('1295307136415735808'), articleId),
      ]);
      context.redirect('back');

      await next();
    });

  const authenticate = koaPassport.authenticate(
    'twitter',
    {
      failureRedirect: '/',
    },
  );

  router.get('/log-in',
    authenticate);

  router.get('/log-out',
    logOutHandler());

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
    redirectAfterAuthenticating());

  router.get('/privacy',
    identifyUser(adapters.logger),
    pageHandler(flow(privacyPage(), TE.rightTask)));

  router.get('/terms',
    identifyUser(adapters.logger),
    pageHandler(flow(termsPage(), TE.rightTask)));

  router.get('/jobs/community-outreach-manager',
    identifyUser(adapters.logger),
    pageHandler(flow(communityOutreachManagerPage(adapters), TE.rightTask)));

  router.get('/robots.txt',
    robots());

  router.get('/static/:file(.+)',
    catchStaticFileErrors(adapters.logger),
    loadStaticFile);

  return router;
};

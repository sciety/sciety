import Router from '@koa/router';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import { authenticate } from './authenticate';
import { catchErrors } from './catch-errors';
import { catchStaticFileErrors } from './catch-static-file-errors';
import { loadStaticFile } from './load-static-file';
import { logOut } from './log-out';
import { onlyIfNotAuthenticated } from './only-if-authenticated';
import { pageHandler } from './page-handler';
import { ping } from './ping';
import { redirectBack } from './redirect-back';
import { redirectAfterAuthenticating, requireAuthentication } from './require-authentication';
import { robots } from './robots';
import { aboutPage } from '../about-page';
import { articleActivityPage, articleMetaPage } from '../article-page';
import { followHandler } from '../follow';
import { finishFollowCommand } from '../follow/finish-follow-command';
import { saveFollowCommand } from '../follow/save-follow-command';
import { groupPage } from '../group-page';
import { homePage } from '../home-page';
import { Adapters } from '../infrastructure/adapters';
import { privacyPage } from '../privacy-page';
import { respondHandler } from '../respond';
import { finishRespondCommand } from '../respond/finish-respond-command';
import { saveRespondCommand } from '../respond/save-respond-command';
import { finishSaveArticleCommand } from '../save-article/finish-save-article-command';
import { saveSaveArticleCommand } from '../save-article/save-save-article-command';
import { searchPage } from '../search-page';
import { searchResultsPage } from '../search-results-page';
import { termsPage } from '../terms-page';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { GroupIdFromString } from '../types/codecs/GroupIdFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import * as Doi from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { unfollowHandler } from '../unfollow';
import { finishUnfollowCommand } from '../unfollow/finish-unfollow-command';
import { saveUnfollowCommand } from '../unfollow/save-unfollow-command';
import { userPage } from '../user-page';

const biorxivPrefix = '10.1101';

const toNotFound = () => ({
  type: 'not-found' as const,
  message: toHtmlFragment('Page not found'),
});

// TODO move into the codecs
const ensureBiorxivDoiParam = <T extends { doi: Doi.Doi }>(params: T) => pipe(
  params,
  E.fromPredicate(({ doi }) => pipe(doi, Doi.hasPrefix(biorxivPrefix)), toNotFound),
);

const articlePageParams = t.type({
  doi: DoiFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

const groupPageParams = t.type({
  id: GroupIdFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

const homePageParams = t.type({
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

const searchResultsPageParams = t.type({
  query: t.string,
});

const userPageParams = t.type({
  id: UserIdFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

export const createRouter = (adapters: Adapters): Router => {
  const router = new Router();

  // PAGES

  router.get('/',
    pageHandler(flow(
      homePageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chainW(flow(
        homePage(adapters),
        TE.rightTask,
      )),
    )));

  router.get('/about',
    pageHandler(() => aboutPage(adapters.fetchStaticFile)));

  router.get('/users/:id(.+)',
    pageHandler(flow(
      userPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(userPage(adapters)),
    )));

  router.get('/articles',
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(flow(
      searchResultsPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(searchResultsPage(adapters)),
    )));

  router.get('/search',
    pageHandler(() => pipe(searchPage, TE.right)));

  router.get('/articles/:doi(10\\..+)',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/articles/activity/${context.params.doi}`);

      await next();
    });

  router.get('/articles/meta/:doi(.+)',
    pageHandler(flow(
      articlePageParams.decode,
      E.mapLeft(toNotFound),
      E.chain(ensureBiorxivDoiParam),
      TE.fromEither,
      TE.chain((args) => articleMetaPage(args)(adapters)),
    )));

  router.get('/articles/activity/:doi(.+)',
    pageHandler(flow(
      articlePageParams.decode,
      E.mapLeft(toNotFound),
      E.chain(ensureBiorxivDoiParam),
      TE.fromEither,
      TE.chain((args) => articleActivityPage(args)(adapters)),
    )));

  router.get('/groups/:id',
    pageHandler(flow(
      groupPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(groupPage(adapters)),
    )));

  router.get('/editorial-communities/:id',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/groups/${context.params.id}`);

      await next();
    });

  router.get('/privacy',
    pageHandler(() => pipe(privacyPage, TE.right)));

  router.get('/terms',
    pageHandler(() => pipe(termsPage, TE.right)));

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
    async (context: ParameterizedContext, next) => {
      if (!context.session.successRedirect) {
        context.session.successRedirect = context.request.headers.referer ?? '/';
      }
      await next();
    },
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
    onlyIfNotAuthenticated(authenticate),
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

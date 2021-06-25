import Router from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import { authenticate } from './authenticate';
import { catchErrors } from './catch-errors';
import { catchStaticFileErrors } from './catch-static-file-errors';
import { executeIfAuthenticated } from './execute-if-authenticated';
import { finishCommand } from './finish-command';
import { loadStaticFile } from './load-static-file';
import { logOut } from './log-out';
import { onlyIfNotAuthenticated } from './only-if-authenticated';
import { pageHandler, toErrorResponse } from './page-handler';
import { ping } from './ping';
import { redirectBack } from './redirect-back';
import { redirectAfterAuthenticating, requireAuthentication } from './require-authentication';
import { robots } from './robots';
import { aboutPage } from '../about-page';
import { articleActivityPage, articleMetaPage } from '../article-page';
import { finishUnfollowCommand, saveUnfollowCommand, unfollowHandler } from '../follow';
import { groupPage, paramsCodec as groupPageParams } from '../group-page';
import { groupsPage } from '../groups-page';
import { Adapters } from '../infrastructure/adapters';
import { landingPage, landingPageLayout } from '../landing-page';
import { legalPage } from '../legal-page';
import { loggedInHomePage } from '../logged-in-home-page';
import { menuPageLayout } from '../menu-page/menu-page-layout';
import { respondHandler } from '../respond';
import { finishRespondCommand } from '../respond/finish-respond-command';
import { saveRespondCommand } from '../respond/save-respond-command';
import { finishSaveArticleCommand } from '../save-article/finish-save-article-command';
import { saveSaveArticleCommand } from '../save-article/save-save-article-command';
import { searchPage } from '../search-page';
import { searchResultsPage, paramsCodec as searchResultsPageParams } from '../search-results-page';
import { applyStandardPageLayout } from '../shared-components/apply-standard-page-layout';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import * as DE from '../types/data-error';
import * as Doi from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { followedGroupsPage } from '../user-page/followed-groups-page/followed-groups-page';
import { savedArticlesPage } from '../user-page/saved-articles-page/saved-articles-page';

const biorxivPrefix = '10.1101';

const toNotFound = () => ({
  type: DE.notFound,
  message: toHtmlFragment('Page not found'),
});

// TODO move into the codecs
const ensureBiorxivDoiParam = <T extends { doi: Doi.Doi }>(params: T) => pipe(
  params,
  E.fromPredicate(({ doi }) => pipe(doi, Doi.hasPrefix(biorxivPrefix)), constant('Not a bioRxiv DOI')),
);

const articlePageParams = t.type({
  doi: DoiFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

const groupsPageParams = t.type({
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

const homePageParams = t.type({
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

const userPageParams = t.type({
  id: UserIdFromString,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

export const createRouter = (adapters: Adapters): Router => {
  const router = new Router();

  const toParams = <A>(codec: t.Decoder<unknown, A>) => flow(
    codec.decode,
    E.mapLeft(toNotFound),
    TE.fromEither,
  );

  const toSuccessResponse = (body: string) => ({
    body,
    status: StatusCodes.OK,
  });

  // PAGES

  router.get(
    '/',
    async (context, next) => {
      const response = await pipe(
        context.state,
        toParams(homePageParams),
        TE.map((params) => params.user),
        TE.chainTaskK(O.fold(
          () => pipe(
            landingPage,
            landingPageLayout,
            T.of,
          ),
          (user) => pipe(
            user.id,
            loggedInHomePage(adapters),
            T.map(applyStandardPageLayout(O.some(user))),
          ),
        )),
        TE.match(
          toErrorResponse(O.fromNullable(context.state.user)),
          toSuccessResponse,
        ),
      )();

      context.response.type = 'html';
      Object.assign(context.response, response);
      await next();
    },
  );

  router.get(
    '/menu',
    async (context, next) => {
      context.response.body = menuPageLayout(
        O.fromNullable(context.state.user),
        O.fromNullable(context.request.header.referer),
      );
      context.set('Vary', 'Referer');

      await next();
    },
  );

  router.get(
    '/about',
    pageHandler(() => aboutPage(adapters.fetchStaticFile)),
  );

  router.get(
    '/users/:id(.+)',
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/users/${context.params.id}/saved-articles`);

      await next();
    },
  );

  router.get(
    '/users/:id/saved-articles',
    pageHandler(flow(
      userPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(savedArticlesPage(adapters)),
    )),
  );

  router.get(
    '/users/:id/followed-groups',
    pageHandler(flow(
      userPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(followedGroupsPage(adapters)),
    )),
  );

  router.get(
    '/articles',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect('/search');

      await next();
    },
  );

  router.get(
    '/search',
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(flow(
      searchResultsPageParams.decode,
      E.map((params) => ({
        ...params,
        pageSize: 20,
      })),
      E.fold(
        () => TE.right(searchPage),
        searchResultsPage(adapters),
      ),
    )),
  );

  router.get(
    '/articles/:doi(10\\..+)',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/articles/activity/${context.params.doi}`);

      await next();
    },
  );

  router.get(
    '/articles/meta/:doi(.+)',
    pageHandler(flow(
      articlePageParams.decode,
      E.chainW(ensureBiorxivDoiParam),
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain((args) => articleMetaPage(args)(adapters)),
    )),
  );

  router.get(
    '/articles/activity/:doi(.+)',
    pageHandler(flow(
      articlePageParams.decode,
      E.chainW(ensureBiorxivDoiParam),
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain((args) => articleActivityPage(args)(adapters)),
    )),
  );

  router.get(
    '/groups',
    pageHandler(flow(
      groupsPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chainW(groupsPage(adapters)),
    )),
  );

  router.get(
    '/groups/:id',
    pageHandler(flow(
      groupPageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(groupPage(adapters)),
    )),
  );

  router.get(
    '/editorial-communities/:id',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/groups/${context.params.id}`);

      await next();
    },
  );

  router.redirect('/privacy', '/legal', StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/terms', '/legal', StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/blog', 'https://blog.sciety.org', StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/feedback', 'http://eepurl.com/hBml3D', StatusCodes.PERMANENT_REDIRECT);

  const mailChimpUrl = 'https://us10.list-manage.com/contact-form?u=cdd934bce0d72af033c181267&form_id=4034dccf020ca9b50c404c32007ee091';
  router.redirect('/contact-us', mailChimpUrl, StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/signup', 'http://eepurl.com/hBml3D', StatusCodes.PERMANENT_REDIRECT);

  router.get(
    '/legal',
    pageHandler(() => pipe(legalPage, TE.right)),
  );

  // COMMANDS

  router.post(
    '/follow',
    bodyParser({ enableTypes: ['form'] }),
    executeIfAuthenticated(adapters),
  );

  router.post(
    '/unfollow',
    bodyParser({ enableTypes: ['form'] }),
    saveUnfollowCommand(),
    requireAuthentication,
    unfollowHandler(adapters),
  );

  router.post(
    '/respond',
    bodyParser({ enableTypes: ['form'] }),
    saveRespondCommand,
    requireAuthentication,
    respondHandler(adapters),
  );

  router.post(
    '/save-article',
    bodyParser({ enableTypes: ['form'] }),
    saveSaveArticleCommand,
    requireAuthentication,
    finishSaveArticleCommand(adapters),
    redirectBack,
  );

  // AUTHENTICATION

  router.get(
    '/log-in',
    async (context: ParameterizedContext, next) => {
      if (!context.session.successRedirect) {
        context.session.successRedirect = context.request.headers.referer ?? '/';
      }
      await next();
    },
    async (context, next) => {
      context.request.query.username = 'a';
      context.request.query.password = 'b';
      await next();
    },
    authenticate,
  );

  router.get('/log-out', logOut);

  // TODO set commands as an object on the session rather than individual properties
  router.get(
    '/twitter/callback',
    catchErrors(
      adapters.logger,
      'Detected Twitter callback error',
      'Something went wrong, please try again.',
    ),
    onlyIfNotAuthenticated(authenticate),
    finishCommand(adapters),
    finishUnfollowCommand(adapters),
    finishRespondCommand(adapters),
    finishSaveArticleCommand(adapters),
    redirectAfterAuthenticating(),
  );

  // MISC

  router.get('/ping', ping());

  router.get('/robots.txt', robots());

  router.get(
    '/static/:file(.+)',
    catchStaticFileErrors(adapters.logger),
    loadStaticFile,
  );

  return router;
};

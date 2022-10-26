import path from 'path';
import Router from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { ParameterizedContext } from 'koa';
import bodyParser from 'koa-bodyparser';
import send from 'koa-send';
import { logIn, logInAsSpecificUser, logInCallback } from './authenticate';
import { catchErrors } from './catch-errors';
import { finishCommand } from './finish-command';
import { handleScietyApiCommand } from './handle-sciety-api-command';
import { loadStaticFile } from './load-static-file';
import { logOut } from './log-out';
import { onlyIfNotAuthenticated } from './only-if-authenticated';
import { pageHandler, toErrorResponse } from './page-handler';
import { ping } from './ping';
import { redirectBack } from './redirect-back';
import { redirectUserIdToHandle } from './redirects/redirect-user-id-to-handle';
import { redirectAfterAuthenticating, requireAuthentication } from './require-authentication';
import { robots } from './robots';
import { aboutPage } from '../about-page';
import { addArticleToListCommandHandler } from '../add-article-to-list';
import { addGroupCommandHandler } from '../add-group';
import { createAnnotationFormPage, paramsCodec as createAnnotationFormPageParamsCodec } from '../annotations/create-annotation-form-page';
import { handleCreateAnnotationCommand } from '../annotations/handle-create-annotation-command';
import { supplyFormSubmissionTo } from '../annotations/supply-form-submission-to';
import { articleActivityPage } from '../article-page';
import { addArticleToListCommandCodec } from '../commands';
import { validateInputShape } from '../commands/validate-input-shape';
import { generateDocmaps } from '../docmaps/docmap';
import { docmapIndex } from '../docmaps/docmap-index';
import { hardcodedDocmaps } from '../docmaps/hardcoded-elife-docmaps';
import { elifeArticlesMissingFromSubjectAreaListsJson } from '../elife-articles-missing-from-subject-area-lists-json';
import { evaluationContent, paramsCodec as evaluationContentParams } from '../evaluation-content';
import {
  executeIfAuthenticated, finishUnfollowCommand, saveUnfollowCommand, unfollowHandler,
} from '../follow';
import { page as genericListPage, paramsCodec as genericListPageParams } from '../generic-list-page/page';
import {
  groupPage, paramsCodec as groupPageParamsCodec, groupPageTabs,
} from '../group-page/group-page';
import { groupsPage } from '../groups-page';
import { homePage, homePageLayout, homePageParams } from '../home-page';
import { CollectedPorts } from '../infrastructure';
import { learnAboutPage } from '../learn-about-page';
import { legalPage } from '../legal-page';
import { menuPageLayout } from '../menu-page/menu-page-layout';
import { myFeedPage, myFeedParams } from '../my-feed-page';
import { recordEvaluationCommandHandler } from '../record-evaluation';
import { removeArticleFromListCommandHandler } from '../remove-article-from-list';
import { respondHandler } from '../respond';
import { finishRespondCommand } from '../respond/finish-respond-command';
import { saveRespondCommand } from '../respond/save-respond-command';
import { unsaveArticle } from '../save-article/execute-unsave-article-command';
import { finishSaveArticleCommand } from '../save-article/finish-save-article-command';
import { saveSaveArticleCommand } from '../save-article/save-save-article-command';
import { scietyFeedCodec, scietyFeedPage } from '../sciety-feed-page/sciety-feed-page';
import { searchPage } from '../search-page';
import { searchResultsPage, paramsCodec as searchResultsPageParams } from '../search-results-page';
import { readModelBuiltWithAllCurrentEvents } from '../shared-read-models/elife-articles-missing-from-subject-area-lists';
import { signUpPage } from '../sign-up-page';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { UserIdFromString } from '../types/codecs/UserIdFromString';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { userCodec } from '../types/user';
import { userListPage, paramsCodec as userListPageParams } from '../user-list-page';
import { userPage } from '../user-page/user-page';

const toNotFound = () => ({
  type: DE.notFound,
  message: toHtmlFragment('Page not found'),
});

type GeneratePage<P> = (params: P) => TE.TaskEither<RenderPageError, Page>;

const createPageFromParams = <P>(codec: t.Decoder<unknown, P>, generatePage: GeneratePage<P>) => flow(
  codec.decode,
  E.mapLeft(toNotFound),
  TE.fromEither,
  TE.chain(generatePage),
);

const articlePageParams = t.type({
  doi: DoiFromString,
  user: tt.optionFromNullable(userCodec),
});

const userPageParams = t.type({
  handle: t.string,
  user: tt.optionFromNullable(t.type({
    id: UserIdFromString,
  })),
});

export const createRouter = (ports: CollectedPorts): Router => {
  const router = new Router();

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
        homePageParams.decode,
        E.mapLeft(toNotFound),
        TE.fromEither,
        TE.map((params) => params.user),
        TE.chainTaskK((user) => pipe(
          ports,
          homePage,
          T.map(homePageLayout(user)),
        )),
        TE.match(
          toErrorResponse(O.fromNullable(context.state.user)),
          toSuccessResponse,
        ),
      )();

      context.response.status = response.status;
      context.response.type = 'html';
      context.response.body = response.body;
      await next();
    },
  );

  router.get(
    '/my-feed',
    pageHandler(createPageFromParams(
      myFeedParams,
      myFeedPage(ports),
    )),
  );

  router.get(
    '/sciety-feed',
    pageHandler(createPageFromParams(
      scietyFeedCodec,
      scietyFeedPage(ports)(20),
    )),
  );

  router.get(
    '/menu',
    async (context, next) => {
      context.response.status = StatusCodes.OK;
      context.response.type = 'html';
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
    pageHandler(() => aboutPage(ports.fetchStaticFile)),
  );

  router.get(
    '/learn-about',
    pageHandler(() => pipe(learnAboutPage, TE.right)),
  );

  router.get(
    '/users/:descriptor',
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/users/${context.params.descriptor}/lists`);

      await next();
    },
  );

  router.get(
    '/users/:id/followed-groups',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/users/${context.params.id}/following`);

      await next();
    },
  );

  const matchHandle = '[^0-9][^/]+';

  router.get(
    `/users/:handle(${matchHandle})/saved-articles`,
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/users/${context.params.handle}/lists`);

      await next();
    },
  );

  router.get(
    `/users/:handle(${matchHandle})/lists`,
    pageHandler(createPageFromParams(
      userPageParams,
      userPage(ports)('lists'),
    )),
  );

  router.get(
    '/users/:id([0-9]+)/lists',
    redirectUserIdToHandle(ports, 'lists'),
  );

  router.get(
    `/users/:handle(${matchHandle})/following`,
    pageHandler(createPageFromParams(
      userPageParams,
      userPage(ports)('followed-groups'),
    )),
  );

  router.get(
    '/users/:id([0-9]+)/following',
    redirectUserIdToHandle(ports, 'following'),
  );

  router.get(
    `/users/:handle(${matchHandle})/lists/saved-articles`,
    pageHandler(createPageFromParams(
      userListPageParams,
      userListPage(ports),
    )),
  );

  router.get(
    '/users/:id([0-9]+)/lists/saved-articles',
    redirectUserIdToHandle(ports, 'lists/saved-articles'),
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
      E.fold(
        () => TE.right(searchPage),
        searchResultsPage(ports)(20),
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
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/articles/activity/${context.params.doi}`);

      await next();
    },
  );

  router.get(
    '/evaluations/:reviewid/content',
    pageHandler(createPageFromParams(
      evaluationContentParams,
      evaluationContent(ports),
    ), false),
  );

  router.get(
    '/articles/activity/:doi(.+)',
    pageHandler(flow(
      articlePageParams.decode,
      E.mapLeft(toNotFound),
      TE.fromEither,
      TE.chain(articleActivityPage(ports)),
    )),
  );

  router.get(
    '/groups',
    pageHandler(() => groupsPage(ports)),
  );

  router.get(
    '/groups/:idOrSlug',
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/groups/${context.params.idOrSlug}/about`);

      await next();
    },
  );

  router.get(
    '/groups/:slug/lists',
    pageHandler(createPageFromParams(
      groupPageParamsCodec,
      groupPage(ports)(groupPageTabs.lists),
    )),
  );

  router.get(
    '/groups/:slug/about',
    pageHandler(createPageFromParams(
      groupPageParamsCodec,
      groupPage(ports)(groupPageTabs.about),
    )),
  );

  router.get(
    '/groups/:slug/followers',
    pageHandler(createPageFromParams(
      groupPageParamsCodec,
      groupPage(ports)(groupPageTabs.followers),
    )),
  );

  router.get(
    '/groups/:slug/evaluated-articles',
    async (context, next) => {
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(`/groups/${context.params.slug}`);

      await next();
    },
  );

  router.get(
    '/lists/:id',
    pageHandler(createPageFromParams(
      genericListPageParams,
      genericListPage(ports),
    )),
  );

  router.get(
    '/annotations/create-annotation-form-avasthi-reading',
    pageHandler(createPageFromParams(
      createAnnotationFormPageParamsCodec,
      createAnnotationFormPage,
    )),
  );

  router.redirect('/privacy', '/legal', StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/terms', '/legal', StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/blog', 'https://blog.sciety.org', StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/feedback', 'http://eepurl.com/hBml3D', StatusCodes.PERMANENT_REDIRECT);

  const mailChimpUrl = 'https://us10.list-manage.com/contact-form?u=cdd934bce0d72af033c181267&form_id=4034dccf020ca9b50c404c32007ee091';
  router.redirect('/contact-us', mailChimpUrl, StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/subscribe-to-mailing-list', 'http://eepurl.com/hBml3D', StatusCodes.PERMANENT_REDIRECT);

  router.get(
    '/legal',
    pageHandler(() => pipe(legalPage, TE.right)),
  );

  router.get(
    '/sign-up',
    pageHandler(() => pipe(signUpPage, TE.right)),
  );

  // COMMANDS

  router.post(
    '/follow',
    bodyParser({ enableTypes: ['form'] }),
    executeIfAuthenticated(ports),
  );

  router.post(
    '/unfollow',
    bodyParser({ enableTypes: ['form'] }),
    saveUnfollowCommand(),
    requireAuthentication,
    unfollowHandler(ports),
  );

  router.post(
    '/respond',
    bodyParser({ enableTypes: ['form'] }),
    saveRespondCommand,
    requireAuthentication,
    respondHandler(ports),
  );

  router.post(
    '/save-article',
    bodyParser({ enableTypes: ['form'] }),
    saveSaveArticleCommand,
    requireAuthentication,
    finishSaveArticleCommand(ports),
    redirectBack,
  );

  router.post(
    '/unsave-article',
    bodyParser({ enableTypes: ['form'] }),
    requireAuthentication,
    unsaveArticle(ports),
    redirectBack,
  );

  router.post('/record-evaluation', handleScietyApiCommand(ports, recordEvaluationCommandHandler(ports)));

  router.post('/add-article-to-list', handleScietyApiCommand(ports, flow(
    validateInputShape(addArticleToListCommandCodec),
    TE.fromEither,
    TE.chain(addArticleToListCommandHandler(ports)),
  )));

  router.post('/remove-article-from-list', handleScietyApiCommand(ports, removeArticleFromListCommandHandler(ports)));

  router.post('/add-group', handleScietyApiCommand(ports, addGroupCommandHandler(ports)));

  router.post(
    '/annotations/create-annotation',
    supplyFormSubmissionTo(handleCreateAnnotationCommand(ports)),
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
    logIn(process.env.AUTHENTICATION_STRATEGY === 'local' ? 'local' : 'twitter'),
  );

  if (process.env.AUTHENTICATION_STRATEGY === 'local') {
    router.get('/log-in-as', logInAsSpecificUser);
  }

  router.get(
    '/sign-up-call-to-action',
    async (context: ParameterizedContext, next) => {
      context.session.successRedirect = '/';
      await next();
    },
    logIn(process.env.AUTHENTICATION_STRATEGY === 'local' ? 'local' : 'twitter'),
  );

  router.get('/log-out', logOut);

  // TODO set commands as an object on the session rather than individual properties
  router.get(
    '/twitter/callback',
    catchErrors(
      ports.logger,
      'Detected Twitter callback error',
      'Something went wrong, please try again.',
    ),
    onlyIfNotAuthenticated(logInCallback(process.env.AUTHENTICATION_STRATEGY === 'local' ? 'local' : 'twitter')),
    finishCommand(ports),
    finishUnfollowCommand(ports),
    finishRespondCommand(ports),
    finishSaveArticleCommand(ports),
    redirectAfterAuthenticating(),
  );

  // DOCMAPS
  router.get('/docmaps/v1/index', async (context, next) => {
    const response = await docmapIndex(ports)(context.query)();

    context.response.status = response.status;
    context.response.body = response.body;

    await next();
  });

  router.get('/docmaps/v1/articles/:doi(.+).docmap.json', async (context, next) => {
    const response = await pipe(
      context.params.doi,
      generateDocmaps(ports),
      TE.foldW(
        (error) => T.of({
          body: { message: error.message },
          status: error.status,
        }),
        (body) => T.of({
          body,
          status: StatusCodes.OK,
        }),
      ),
    )();

    context.response.status = response.status;
    context.response.body = response.body;
    await next();
  });

  router.get('/docmaps/v1/evaluations-by/elife/:doi(.+).docmap.json', async (context, next) => {
    pipe(
      hardcodedDocmaps,
      R.lookup(context.params.doi),
      O.fold(
        () => {
          context.status = StatusCodes.NOT_FOUND;
          context.body = { message: 'No such hardcoded docmap.' };
          ports.logger('error', 'No such hardcoded docmap.', { doi: context.params.doi });
        },
        (json) => {
          context.response.status = 200;
          context.response.body = json;
        },
      ),
    );

    await next();
  });

  router.get('/docmaps/v1', async (context, next) => {
    const staticFolder = path.resolve(__dirname, '../../static');
    await send(context, 'docmaps-v1-api-docs.html', { root: staticFolder });

    await next();
  });

  // OBSERVABILITY

  const builtReadModel = readModelBuiltWithAllCurrentEvents(ports);

  router.get('/elife-articles-missing-from-subject-area-lists', async (context, next) => {
    context.response.body = await pipe(
      builtReadModel,
      T.map(elifeArticlesMissingFromSubjectAreaListsJson),
    )();
    await next();
  });

  // MISC

  router.get('/ping', ping());

  router.get('/robots.txt', robots());

  router.get(
    '/static/:file(.+)',
    loadStaticFile(ports.logger),
  );

  return router;
};

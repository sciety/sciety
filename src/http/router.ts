import path from 'path';
import Router from '@koa/router';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import send from 'koa-send';
import * as api from './api';
import * as authentication from './authentication';
import { Config as AuthenticationRoutesConfig } from './authentication/configure-routes';
import { EnvironmentVariables } from './environment-variables-codec';
import * as formSubmissionHandlers from './form-submission-handlers';
import * as group from './group';
import { htmlFragmentHandler } from './html-fragment-handler';
import { loadStaticFile } from './load-static-file';
import { pageHandler, pageHandlerWithLoggedInUser } from './page-handler';
import { ping } from './ping';
import { requireLoggedInUser } from './require-logged-in-user';
import { robots } from './robots';
import { DependenciesForViews } from '../read-side/dependencies-for-views';
import { aboutPage } from '../read-side/html-pages/about-page';
import { actionFailedPage, actionFailedPageParamsCodec } from '../read-side/html-pages/action-failed';
import { createAnnotationFormPage, paramsCodec as createAnnotationFormPageParamsCodec } from '../read-side/html-pages/create-annotation-form-page';
import { createPageFromParams } from '../read-side/html-pages/create-page-from-params';
import { editListDetailsFormPage, editListDetailsFormPageParamsCodec } from '../read-side/html-pages/edit-list-details-form-page';
import { groupsPage } from '../read-side/html-pages/groups-page';
import { homePage, homePageLayout } from '../read-side/html-pages/home-page';
import { legalPage } from '../read-side/html-pages/legal-page';
import { page as listPage, paramsCodec as listPageParams } from '../read-side/html-pages/list-page';
import { listsPage, paramsCodec as listsPageParamsCodec } from '../read-side/html-pages/lists-page';
import { myFeedPage, myFeedParams } from '../read-side/html-pages/my-feed-page';
import { paperActivityPage } from '../read-side/html-pages/paper-activity-page';
import { saveArticleFormPage } from '../read-side/html-pages/save-article-form-page';
import { scietyFeedCodec, scietyFeedPage } from '../read-side/html-pages/sciety-feed-page';
import { searchPage } from '../read-side/html-pages/search-page';
import { searchResultsPage, paramsCodec as searchResultsPageParams } from '../read-side/html-pages/search-results-page';
import { fullWidthPageLayout } from '../read-side/html-pages/shared-components/full-width-page-layout';
import { referencePage, sharedComponentsPage, indexPage } from '../read-side/html-pages/style-guide-page';
import { subscribeToListPage } from '../read-side/html-pages/subscribe-to-list-page';
import { userPage as userFollowingPage, userPageParams as userFollowingPageParams } from '../read-side/html-pages/user-page/user-following-page';
import { userPage as userListsPage, userPageParams as userListsPageParams } from '../read-side/html-pages/user-page/user-lists-page';
import { generateDocmaps, docmapIndex } from '../read-side/non-html-views/docmaps';
import { evaluationContent } from '../read-side/non-html-views/evaluation-content';
import { listFeed } from '../read-side/non-html-views/list/list-feed';
import { applicationStatus } from '../read-side/non-html-views/status';
import { statusGroups } from '../read-side/non-html-views/status-groups';
import { constructPaperActivityPageHref, paperActivityPagePathSpecification } from '../read-side/paths';
import { redirectToAvatarImageUrl } from '../read-side/user-avatars';
import * as EDOI from '../types/expression-doi';
import { DependenciesForCommands } from '../write-side/dependencies-for-commands';

type Config = AuthenticationRoutesConfig & EnvironmentVariables;

type Dependencies = DependenciesForCommands & DependenciesForViews;

export const createRouter = (dependencies: Dependencies, config: Config): Router => {
  const router = new Router();

  // PAGES

  router.get(
    '/',
    pageHandler(dependencies, () => TE.right(homePage(dependencies)), homePageLayout),
  );

  router.get(
    '/my-feed',
    pageHandler(dependencies, createPageFromParams(
      myFeedParams,
      myFeedPage(dependencies),
    )),
  );

  router.get(
    '/sciety-feed',
    pageHandler(dependencies, createPageFromParams(
      scietyFeedCodec,
      scietyFeedPage(dependencies)(20),
    )),
  );

  router.get(
    '/about',
    pageHandler(dependencies, () => aboutPage({})),
  );

  router.get(
    '/lists/:listId/subscribe',
    pageHandler(dependencies, subscribeToListPage(dependencies)),
  );

  router.get(
    '/action-failed',
    pageHandler(dependencies,
      createPageFromParams(
        actionFailedPageParamsCodec,
        actionFailedPage,
      )),
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
    '/users/:handle/lists',
    pageHandler(dependencies, createPageFromParams(
      userListsPageParams,
      userListsPage(dependencies),
    )),
  );

  router.get(
    '/users/:handle/following',
    pageHandler(dependencies, createPageFromParams(
      userFollowingPageParams,
      userFollowingPage(dependencies),
    )),
  );

  router.get(
    '/users/:handle/avatar',
    redirectToAvatarImageUrl(dependencies),
  );

  router.get(
    '/search',
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(dependencies, flow(
      searchResultsPageParams.decode,
      E.fold(
        () => TE.right(searchPage),
        searchResultsPage(dependencies)(20),
      ),
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

  const doesNotBeginWithActivity = '10\\..+';

  router.get(
    `/articles/:expressionDoi(${doesNotBeginWithActivity})`,
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(constructPaperActivityPageHref(EDOI.fromValidatedString(context.params.expressionDoi)));

      await next();
    },
  );

  router.get(
    '/articles/meta/:expressionDoi(.+)',
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(constructPaperActivityPageHref(EDOI.fromValidatedString(context.params.expressionDoi)));

      await next();
    },
  );

  router.get(
    paperActivityPagePathSpecification,
    pageHandler(dependencies, paperActivityPage(dependencies), fullWidthPageLayout),
  );

  router.get(
    '/evaluations/:reviewid/content',
    htmlFragmentHandler(evaluationContent(dependencies)),
  );

  router.get(
    '/groups',
    pageHandler(dependencies, () => groupsPage(dependencies)),
  );

  router.get(
    '/lists',
    pageHandler(dependencies, createPageFromParams(
      listsPageParamsCodec,
      listsPage(dependencies),
    )),
  );

  router.get(
    '/lists/:id',
    pageHandler(dependencies, createPageFromParams(
      listPageParams,
      listPage(dependencies),
    ), fullWidthPageLayout),
  );

  router.get(
    '/lists/:id/feed.atom',
    listFeed(dependencies),
  );

  router.get(
    '/lists/:id/edit-details',
    pageHandler(dependencies, createPageFromParams(
      editListDetailsFormPageParamsCodec,
      editListDetailsFormPage(dependencies),
    )),
  );

  router.get(
    '/save-article',
    pageHandlerWithLoggedInUser(dependencies, saveArticleFormPage(dependencies)),
  );

  router.get(
    '/annotations/create-annotation-form',
    requireLoggedInUser(dependencies),
    pageHandler(dependencies, createPageFromParams(
      createAnnotationFormPageParamsCodec,
      createAnnotationFormPage(dependencies),
    )),
  );

  router.redirect('/blog', 'https://blog.sciety.org', StatusCodes.TEMPORARY_REDIRECT);

  const mailChimpUrl = 'https://us10.list-manage.com/contact-form?u=cdd934bce0d72af033c181267&form_id=4034dccf020ca9b50c404c32007ee091';
  router.redirect('/contact-us', mailChimpUrl, StatusCodes.TEMPORARY_REDIRECT);

  router.redirect('/subscribe-to-mailing-list', 'http://eepurl.com/hBml3D', StatusCodes.TEMPORARY_REDIRECT);

  router.get(
    '/legal',
    pageHandler(dependencies, () => pipe(legalPage, TE.right)),
  );

  router.get(
    '/style-guide',
    pageHandler(dependencies, () => pipe(indexPage, TE.right)),
  );

  router.get(
    '/style-guide/reference',
    pageHandler(dependencies, () => pipe(referencePage, TE.right)),
  );

  router.get(
    '/style-guide/shared-components',
    pageHandler(dependencies, () => pipe(sharedComponentsPage, TE.right)),
  );

  api.configureRoutes(router, dependencies, config.SCIETY_TEAM_API_BEARER_TOKEN);

  formSubmissionHandlers.configureRoutes(router, dependencies);

  authentication.configureRoutes(router, dependencies, config);

  group.configureRoutes(router, dependencies);

  // DOCMAPS
  router.get('/docmaps/v1/index', async (context, next) => {
    const response = await docmapIndex(dependencies)(context.query)();

    context.response.status = response.status;
    context.response.body = response.body;

    await next();
  });

  router.get('/docmaps/v1/articles/:doi(.+).docmap.json', async (context, next) => {
    const response = await pipe(
      context.params.doi,
      generateDocmaps(dependencies),
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

  router.get('/docmaps/v1', async (context, next) => {
    const staticFolder = path.resolve(__dirname, '../../static');
    await send(context, 'docmaps-v1-api-docs.html', { root: staticFolder });

    await next();
  });

  // OBSERVABILITY

  router.get('/status', async (context, next) => {
    context.response.body = applicationStatus(dependencies);
    context.response.status = StatusCodes.OK;
    await next();
  });

  router.get('/status/groups', async (context, next) => {
    context.response.body = statusGroups(dependencies);
    context.response.status = StatusCodes.OK;
    await next();
  });

  // MISC

  router.get('/ping', ping());

  router.get('/robots.txt', robots());

  router.get(
    '/static/:file(.+)',
    loadStaticFile(dependencies),
  );

  return router;
};

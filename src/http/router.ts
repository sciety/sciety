import path from 'path';
import Router from '@koa/router';
import * as E from 'fp-ts/Either';
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
import { loadStaticFile } from './load-static-file';
import { pageHandler, pageHandlerWithLoggedInUser } from './page-handler';
import { ping } from './ping';
import { requireLoggedInUser } from './require-logged-in-user';
import { robots } from './robots';
import { routeForNonHtmlView } from './route-for-non-html-view';
import { DependenciesForViews } from '../read-side/dependencies-for-views';
import { aboutPage } from '../read-side/html-pages/about-page';
import { actionFailedPage, actionFailedPageParamsCodec } from '../read-side/html-pages/action-failed';
import { categoryPage } from '../read-side/html-pages/category-page';
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
import { searchPage } from '../read-side/html-pages/search-page';
import { searchResultsPage, paramsCodec as searchResultsPageParams } from '../read-side/html-pages/search-results-page';
import { fullWidthPageLayout } from '../read-side/html-pages/shared-components/full-width-page-layout';
import { referencePage, sharedComponentsPage, indexPage } from '../read-side/html-pages/style-guide-page';
import { subscribeToListPage } from '../read-side/html-pages/subscribe-to-list-page';
import { userPage as userFollowingPage, userPageParams as userFollowingPageParams } from '../read-side/html-pages/user-page/user-following-page';
import { userPage as userListsPage, userPageParams as userListsPageParams } from '../read-side/html-pages/user-page/user-lists-page';
import { docmapIndex, docmap } from '../read-side/non-html-views/docmaps';
import { evaluationContent } from '../read-side/non-html-views/evaluation-content';
import { constructPaperActivityPageHref, paperActivityPagePathSpecification } from '../read-side/paths';
import { categoryPagePathSpecification } from '../read-side/paths/construct-category-page-href';
import { redirectToAvatarImageUrl } from '../read-side/user-avatars';
import * as EDOI from '../types/expression-doi';
import { DependenciesForCommands } from '../write-side';

type Config = AuthenticationRoutesConfig & EnvironmentVariables;

type Dependencies = DependenciesForCommands & DependenciesForViews;

export const createRouter = (dependencies: Dependencies, config: Config): Router => {
  const router = new Router();

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Routes with inline middleware

  router.get(
    '/users/:descriptor',
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/users/${context.params.descriptor}/lists`);
      await next();
    },
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
        () => searchPage(dependencies),
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
    '/annotations/create-annotation-form',
    requireLoggedInUser(dependencies),
    pageHandler(dependencies, createPageFromParams(
      dependencies.logger,
      createAnnotationFormPageParamsCodec,
      createAnnotationFormPage(dependencies),
    )),
  );

  router.get('/docmaps/v1', async (context, next) => {
    const staticFolder = path.resolve(__dirname, '../../static');
    await send(context, 'docmaps-v1-api-docs.html', { root: staticFolder });
    await next();
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const nonHtmlViews = [
    { endpoint: '/evaluations/:reviewid/content', handler: evaluationContent },
    { endpoint: '/docmaps/v1/index', handler: docmapIndex },
    { endpoint: '/docmaps/v1/articles/:doi(.+).docmap.json', handler: docmap },
  ];

  nonHtmlViews.forEach((route) => {
    router.get(route.endpoint, routeForNonHtmlView(route.handler(dependencies)));
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const mailChimpUrl = 'https://us10.list-manage.com/contact-form?u=cdd934bce0d72af033c181267&form_id=4034dccf020ca9b50c404c32007ee091';
  const temporaryRedirects = [
    { from: '/blog', to: 'https://blog.sciety.org' },
    { from: '/contact-us', to: mailChimpUrl },
    { from: '/subscribe-to-mailing-list', to: 'http://eepurl.com/hBml3D' },
  ];

  temporaryRedirects.forEach((route) => {
    router.redirect(route.from, route.to, StatusCodes.TEMPORARY_REDIRECT);
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const staticPages = [
    { endpoint: '/legal', handler: legalPage },
    { endpoint: '/style-guide', handler: indexPage },
    { endpoint: '/style-guide/reference', handler: referencePage },
    { endpoint: '/style-guide/shared-components', handler: sharedComponentsPage },
  ];

  staticPages.forEach((route) => {
    router.get(route.endpoint, pageHandler(dependencies, () => pipe(route.handler, TE.right)));
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  api.configureRoutes(router, dependencies, config.SCIETY_TEAM_API_BEARER_TOKEN);

  formSubmissionHandlers.configureRoutes(router, dependencies);

  authentication.configureRoutes(router, dependencies, config);

  group.configureRoutes(router, dependencies);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  const simpleHtmlPages = [
    {
      endpoint: '/',
      handler: pageHandler(dependencies, () => TE.right(homePage(dependencies)), homePageLayout),
    },
    {
      endpoint: '/about',
      handler: pageHandler(dependencies, () => aboutPage({})),
    },
    {
      endpoint: '/lists/:listId/subscribe',
      handler: pageHandler(dependencies, subscribeToListPage(dependencies)),
    },
    {
      endpoint: paperActivityPagePathSpecification,
      handler: pageHandler(dependencies, paperActivityPage(dependencies), fullWidthPageLayout),
    },
    {
      endpoint: '/groups',
      handler: pageHandler(dependencies, () => groupsPage(dependencies)),
    },
    {
      endpoint: categoryPagePathSpecification,
      handler: pageHandler(dependencies, categoryPage(dependencies)),
    },
    {
      endpoint: '/save-article',
      handler: pageHandlerWithLoggedInUser(dependencies, saveArticleFormPage(dependencies)),
    },
  ];

  const htmlPagesWithExposedParamsCodecs = [
    {
      endpoint: '/my-feed',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        myFeedParams,
        myFeedPage(dependencies),
      )),
    },
    {
      endpoint: '/lists/:id/edit-details',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        editListDetailsFormPageParamsCodec,
        editListDetailsFormPage(dependencies),
      )),
    },
    {
      endpoint: '/lists',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        listsPageParamsCodec,
        listsPage(dependencies),
      )),
    },
    {
      endpoint: '/lists/:id',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        listPageParams,
        listPage(dependencies),
      ), fullWidthPageLayout),
    },
    {
      endpoint: '/users/:handle/lists',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        userListsPageParams,
        userListsPage(dependencies),
      )),
    },
    {
      endpoint: '/users/:handle/following',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        userFollowingPageParams,
        userFollowingPage(dependencies),
      )),
    },
    {
      endpoint: '/action-failed',
      handler: pageHandler(dependencies, createPageFromParams(
        dependencies.logger,
        actionFailedPageParamsCodec,
        actionFailedPage,
      )),
    },
  ];

  const miscellaneous = [
    { endpoint: '/ping', handler: ping() },
    { endpoint: '/robots.txt', handler: robots() },
    { endpoint: '/static/:file(.+)', handler: loadStaticFile(dependencies) },
    { endpoint: '/users/:handle/avatar', handler: redirectToAvatarImageUrl(dependencies) },
  ];

  [
    ...simpleHtmlPages,
    ...htmlPagesWithExposedParamsCodecs,
    ...miscellaneous,
  ].forEach((route) => router.get(route.endpoint, route.handler));

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  return router;
};

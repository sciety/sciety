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
import { createPageFromParams } from './create-page-from-params';
import { EnvironmentVariables } from './environment-variables-codec';
import * as formSubmissionHandlers from './form-submission-handlers';
import { htmlFragmentHandler } from './html-fragment-handler';
import { loadStaticFile } from './load-static-file';
import { pageHandler } from './page-handler';
import { ping } from './ping';
import { requireLoggedInUser } from './require-logged-in-user';
import { robots } from './robots';
import { generateDocmaps } from '../docmaps/docmap';
import { docmapIndex } from '../docmaps/docmap-index';
import { evaluationContent, paramsCodec as evaluationContentParams } from '../evaluation-content';
import { actionFailedPage, actionFailedPageParamsCodec } from '../html-pages/action-failed';
import { createAnnotationFormPage, paramsCodec as createAnnotationFormPageParamsCodec } from '../html-pages/create-annotation-form-page';
import { editListDetailsFormPage, editListDetailsFormPageParamsCodec } from '../html-pages/edit-list-details-form-page';
import { page as listPage, paramsCodec as listPageParams } from '../html-pages/list-page';
import { listsPage, paramsCodec as listsPageParamsCodec } from '../html-pages/lists-page';
import { myFeedPage, myFeedParams } from '../html-pages/my-feed-page';
import { paperActivityPage } from '../html-pages/paper-activity-page';
import { saveArticleFormPage } from '../html-pages/save-article-form-page';
import { scietyFeedCodec, scietyFeedPage } from '../html-pages/sciety-feed-page';
import { searchPage } from '../html-pages/search-page';
import { searchResultsPage, paramsCodec as searchResultsPageParams } from '../html-pages/search-results-page';
import { referencePage, sharedComponentsPage, indexPage } from '../html-pages/style-guide-page';
import { subscribeToListPage } from '../html-pages/subscribe-to-list-page';
import { userPage as userFollowingPage, userPageParams as userFollowingPageParams } from '../html-pages/user-page/user-following-page';
import { userPage as userListsPage, userPageParams as userListsPageParams } from '../html-pages/user-page/user-lists-page';
import { CollectedPorts } from '../infrastructure';
import { aboutPage } from '../read-side/html-pages/about-page';
import * as GAP from '../read-side/html-pages/group-page/group-about-page';
import { addAFeaturedListFormPage, addAFeaturedListFormPageParamsCodec } from '../read-side/html-pages/group-page/group-add-a-featured-list-form-page';
import * as GFP from '../read-side/html-pages/group-page/group-followers-page';
import * as GHP from '../read-side/html-pages/group-page/group-home-page';
import * as GLP from '../read-side/html-pages/group-page/group-lists-page';
import { groupsPage } from '../read-side/html-pages/groups-page';
import { homePage, homePageLayout } from '../read-side/html-pages/home-page';
import { legalPage } from '../read-side/html-pages/legal-page';
import { listFeed } from '../read-side/non-html-views/list/list-feed';
import { applicationStatus } from '../read-side/non-html-views/status';
import { statusGroups } from '../read-side/non-html-views/status-groups';
import { groupPagePathSpecification, constructPaperActivityPageHref, paperActivityPagePathSpecification } from '../read-side/paths';
import { redirectToAvatarImageUrl } from '../read-side/user-avatars';
import { fullWidthPageLayout } from '../shared-components/full-width-page-layout';
import * as EDOI from '../types/expression-doi';

type Config = AuthenticationRoutesConfig & EnvironmentVariables;

export const createRouter = (adapters: CollectedPorts, config: Config): Router => {
  const router = new Router();

  // PAGES

  router.get(
    '/',
    pageHandler(adapters, () => TE.right(homePage(adapters)), homePageLayout),
  );

  router.get(
    '/my-feed',
    pageHandler(adapters, createPageFromParams(
      myFeedParams,
      myFeedPage(adapters),
    )),
  );

  router.get(
    '/sciety-feed',
    pageHandler(adapters, createPageFromParams(
      scietyFeedCodec,
      scietyFeedPage(adapters)(20),
    )),
  );

  router.get(
    '/about',
    pageHandler(adapters, () => aboutPage({})),
  );

  router.get(
    '/lists/:listId/subscribe',
    pageHandler(adapters, subscribeToListPage(adapters)),
  );

  router.get(
    '/action-failed',
    pageHandler(adapters,
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
    pageHandler(adapters, createPageFromParams(
      userListsPageParams,
      userListsPage(adapters),
    )),
  );

  router.get(
    '/users/:handle/following',
    pageHandler(adapters, createPageFromParams(
      userFollowingPageParams,
      userFollowingPage(adapters),
    )),
  );

  router.get(
    '/users/:handle/avatar',
    redirectToAvatarImageUrl(adapters),
  );

  router.get(
    '/search',
    async (context, next) => {
      context.response.set('X-Robots-Tag', 'noindex');
      await next();
    },
    pageHandler(adapters, flow(
      searchResultsPageParams.decode,
      E.fold(
        () => TE.right(searchPage),
        searchResultsPage(adapters)(20),
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
      context.status = StatusCodes.PERMANENT_REDIRECT;
      context.redirect(constructPaperActivityPageHref(EDOI.fromValidatedString(context.params.expressionDoi)));

      await next();
    },
  );

  router.get(
    paperActivityPagePathSpecification,
    pageHandler(adapters, paperActivityPage(adapters), fullWidthPageLayout),
  );

  router.get(
    '/evaluations/:reviewid/content',
    htmlFragmentHandler(
      createPageFromParams(
        evaluationContentParams,
        evaluationContent(adapters),
      ),
    ),
  );

  router.get(
    '/groups',
    pageHandler(adapters, () => groupsPage(adapters)),
  );

  router.get(
    groupPagePathSpecification,
    pageHandler(adapters, createPageFromParams(
      GHP.paramsCodec,
      GHP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    '/groups/:slug/lists',
    pageHandler(adapters, createPageFromParams(
      GLP.paramsCodec,
      GLP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    '/groups/:slug/about',
    pageHandler(adapters, createPageFromParams(
      GAP.paramsCodec,
      GAP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    '/groups/:slug/followers',
    pageHandler(adapters, createPageFromParams(
      GFP.paramsCodec,
      GFP.constructAndRenderPage(adapters),
    )),
  );

  router.get(
    '/groups/:slug/feed',
    async (context, next) => {
      context.status = StatusCodes.TEMPORARY_REDIRECT;
      context.redirect(`/groups/${context.params.slug}`);

      await next();
    },
  );

  router.get(
    '/groups/:slug/add-a-featured-list',
    requireLoggedInUser(adapters),
    pageHandler(adapters, createPageFromParams(
      addAFeaturedListFormPageParamsCodec,
      addAFeaturedListFormPage(adapters),
    )),
  );

  router.get(
    '/lists',
    pageHandler(adapters, createPageFromParams(
      listsPageParamsCodec,
      listsPage(adapters),
    )),
  );

  router.get(
    '/lists/:id',
    pageHandler(adapters, createPageFromParams(
      listPageParams,
      listPage(adapters),
    ), fullWidthPageLayout),
  );

  router.get(
    '/lists/:id/feed.atom',
    listFeed(adapters),
  );

  router.get(
    '/lists/:id/edit-details',
    pageHandler(adapters, createPageFromParams(
      editListDetailsFormPageParamsCodec,
      editListDetailsFormPage(adapters),
    )),
  );

  router.get(
    '/save-article',
    requireLoggedInUser(adapters),
    pageHandler(adapters, saveArticleFormPage(adapters)),
  );

  router.get(
    '/annotations/create-annotation-form',
    requireLoggedInUser(adapters),
    pageHandler(adapters, createPageFromParams(
      createAnnotationFormPageParamsCodec,
      createAnnotationFormPage(adapters),
    )),
  );

  router.redirect('/blog', 'https://blog.sciety.org', StatusCodes.PERMANENT_REDIRECT);

  const mailChimpUrl = 'https://us10.list-manage.com/contact-form?u=cdd934bce0d72af033c181267&form_id=4034dccf020ca9b50c404c32007ee091';
  router.redirect('/contact-us', mailChimpUrl, StatusCodes.PERMANENT_REDIRECT);

  router.redirect('/subscribe-to-mailing-list', 'http://eepurl.com/hBml3D', StatusCodes.PERMANENT_REDIRECT);

  router.get(
    '/legal',
    pageHandler(adapters, () => pipe(legalPage, TE.right)),
  );

  router.get(
    '/style-guide',
    pageHandler(adapters, () => pipe(indexPage, TE.right)),
  );

  router.get(
    '/style-guide/reference',
    pageHandler(adapters, () => pipe(referencePage, TE.right)),
  );

  router.get(
    '/style-guide/shared-components',
    pageHandler(adapters, () => pipe(sharedComponentsPage, TE.right)),
  );

  api.configureRoutes(router, adapters, config.SCIETY_TEAM_API_BEARER_TOKEN);

  formSubmissionHandlers.configureRoutes(router, adapters);

  authentication.configureRoutes(router, adapters, config);

  // DOCMAPS
  router.get('/docmaps/v1/index', async (context, next) => {
    const response = await docmapIndex(adapters)(context.query)();

    context.response.status = response.status;
    context.response.body = response.body;

    await next();
  });

  router.get('/docmaps/v1/articles/:doi(.+).docmap.json', async (context, next) => {
    const response = await pipe(
      context.params.doi,
      generateDocmaps(adapters),
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
    context.response.body = applicationStatus(adapters);
    context.response.status = StatusCodes.OK;
    await next();
  });

  router.get('/status/groups', async (context, next) => {
    context.response.body = statusGroups(adapters);
    context.response.status = StatusCodes.OK;
    await next();
  });

  // MISC

  router.get('/ping', ping());

  router.get('/robots.txt', robots());

  router.get(
    '/static/:file(.+)',
    loadStaticFile(adapters),
  );

  return router;
};

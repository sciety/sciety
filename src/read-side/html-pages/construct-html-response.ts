import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CompleteHtmlDocument } from './complete-html-document';
import { ErrorPageViewModel } from './construct-error-page-view-model';
import { HtmlPage, toHtmlPage } from './html-page';
import { PageLayout } from './page-layout';
import { PageLayoutViewModel } from './page-layout-view-model';
import { renderOopsMessage } from './render-oops-message';
import { ClientClassification } from './shared-components/head';
import { renderStandardPageLayout } from './shared-components/standard-page-layout';
import { wrapInHtmlDocument } from './wrap-in-html-document';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';
import { DependenciesForViews } from '../dependencies-for-views';

export type Dependencies = DependenciesForViews;

const constructLoggedInUserDetails = (dependencies: Dependencies, loggedInUserId: O.Option<UserId>) => pipe(
  loggedInUserId,
  O.chain((id) => dependencies.lookupUser(id)),
);

const constructLayoutViewModel = (
  dependencies: Dependencies,
  loggedInUserId: O.Option<UserId>,
): PageLayoutViewModel => {
  const user = constructLoggedInUserDetails(dependencies, loggedInUserId);
  return ({
    userDetails: user,
  });
};

const toErrorResponse = (
  dependencies: Dependencies,
  loggedInUserId: O.Option<UserId>,
  clientClassification: ClientClassification,
) => (
  error: ErrorPageViewModel,
): HtmlResponse => pipe(
  renderOopsMessage(error.message),
  (content) => toHtmlPage({
    title: 'Error',
    content,
  }),
  renderStandardPageLayout(constructLayoutViewModel(dependencies, loggedInUserId)),
  wrapInHtmlDocument({ title: 'Error', loggedInUserId, clientClassification }),
  (document) => ({
    document,
    error: O.some(error.type),
  }),
);

const pageToSuccessResponse = (
  dependencies: Dependencies,
  loggedInUserId: O.Option<UserId>,
  pageLayout: PageLayout,
  clientClassification: ClientClassification,
) => (page: HtmlPage): HtmlResponse => ({
  document: pipe(
    page,
    pageLayout(constructLayoutViewModel(dependencies, loggedInUserId)),
    wrapInHtmlDocument({ ...page, loggedInUserId, clientClassification }),
  ),
  error: O.none,
});

export type HtmlResponse = {
  document: CompleteHtmlDocument,
  error: O.Option<DE.DataError>,
};

type ConstructHtmlResponse = (
  dependencies: Dependencies,
  loggedInUserId: O.Option<UserId>,
  pageLayout: PageLayout,
  clientClassification: ClientClassification)
=> (renderedPage: E.Either<ErrorPageViewModel, HtmlPage>)
=> HtmlResponse;

export const constructHtmlResponse: ConstructHtmlResponse = (
  dependencies,
  loggedInUserId,
  pageLayout,
  clientClassification,
) => (renderedPage) => pipe(
  renderedPage,
  E.fold(
    toErrorResponse(dependencies, loggedInUserId, clientClassification),
    pageToSuccessResponse(dependencies, loggedInUserId, pageLayout, clientClassification),
  ),
);

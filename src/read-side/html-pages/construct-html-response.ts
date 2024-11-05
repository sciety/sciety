import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CompleteHtmlDocument } from './complete-html-document';
import { ErrorPageViewModel } from './construct-error-page-view-model';
import { HtmlPage, toHtmlPage } from './html-page';
import { PageLayout, PageLayoutViewModel } from './page-layout';
import { renderOopsMessage } from './render-oops-message';
import { ClientClassification } from './shared-components/head';
import { renderStandardPageLayout } from './shared-components/standard-page-layout';
import { wrapInHtmlDocument } from './wrap-in-html-document';
import * as DE from '../../types/data-error';
import { UserDetails } from '../../types/user-details';
import { UserId } from '../../types/user-id';
import { DependenciesForViews } from '../dependencies-for-views';

export type Dependencies = DependenciesForViews;

const constructLoggedInUserDetails = (dependencies: Dependencies, loggedInUserId: O.Option<UserId>) => pipe(
  loggedInUserId,
  O.chain((id) => dependencies.lookupUser(id)),
);

const constructLayoutViewModel = (user: O.Option<UserDetails>): PageLayoutViewModel => ({
  userDetails: user,
});

const toErrorResponse = (
  user: O.Option<UserDetails>,
  clientClassification: ClientClassification,
) => (
  error: ErrorPageViewModel,
): HtmlResponse => pipe(
  renderOopsMessage(error.message),
  (content) => toHtmlPage({
    title: 'Error',
    content,
  }),
  renderStandardPageLayout(constructLayoutViewModel(user)),
  wrapInHtmlDocument({ title: 'Error', loggedInUserId: pipe(user, O.map((u) => u.id)), clientClassification }),
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
) => (page: HtmlPage): HtmlResponse => {
  const user = constructLoggedInUserDetails(dependencies, loggedInUserId);
  return ({
    document: pipe(
      page,
      pageLayout(constructLayoutViewModel(user)),
      wrapInHtmlDocument({ ...page, loggedInUserId: pipe(user, O.map((u) => u.id)), clientClassification }),
    ),
    error: O.none,
  });
};

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
    toErrorResponse(constructLoggedInUserDetails(dependencies, loggedInUserId), clientClassification),
    pageToSuccessResponse(dependencies, loggedInUserId, pageLayout, clientClassification),
  ),
);

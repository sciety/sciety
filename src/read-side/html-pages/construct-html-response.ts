import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CompleteHtmlDocument } from './complete-html-document';
import { ErrorPageViewModel } from './construct-error-page-view-model';
import { constructLayoutViewModel } from './construct-layout-view-model';
import { HtmlPage, toHtmlPage } from './html-page';
import { renderOopsMessage } from './render-oops-message';
import { RenderPageLayout } from './render-page-layout';
import { ClientClassification } from './shared-components/head';
import { renderStandardPageLayout } from './shared-components/standard-page-layout';
import { wrapInHtmlDocument } from './wrap-in-html-document';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';
import { DependenciesForViews } from '../dependencies-for-views';

export type Dependencies = DependenciesForViews;

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
  pageLayout: RenderPageLayout,
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
  pageLayout: RenderPageLayout,
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

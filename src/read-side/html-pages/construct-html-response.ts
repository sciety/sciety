import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { CompleteHtmlDocument } from './complete-html-document';
import { HtmlPage, toHtmlPage } from './html-page';
import { PageLayout } from './page-layout';
import { renderOopsMessage } from './render-oops-message';
import { wrapInHtmlDocument } from './wrap-in-html-document';
import { ClientClassification } from '../../shared-components/head';
import { standardPageLayout } from '../../shared-components/standard-page-layout';
import * as DE from '../../types/data-error';
import { ErrorPageBodyViewModel } from '../../types/error-page-body-view-model';
import { UserDetails } from '../../types/user-details';

const toErrorResponse = (
  user: O.Option<UserDetails>,
  clientClassification: ClientClassification,
) => (
  error: ErrorPageBodyViewModel,
): HtmlResponse => pipe(
  renderOopsMessage(error.message),
  (content) => toHtmlPage({
    title: 'Error',
    content,
  }),
  standardPageLayout(user),
  wrapInHtmlDocument(user, { title: 'Error', clientClassification }),
  (document) => ({
    document,
    error: O.some(error.type),
  }),
);

const pageToSuccessResponse = (
  user: O.Option<UserDetails>,
  pageLayout: PageLayout,
  clientClassification: ClientClassification,
) => (page: HtmlPage): HtmlResponse => ({
  document: pipe(
    page,
    pageLayout(user),
    wrapInHtmlDocument(user, { ...page, clientClassification }),
  ),
  error: O.none,
});

export type HtmlResponse = {
  document: CompleteHtmlDocument,
  error: O.Option<DE.DataError>,
};

type ConstructHtmlResponse = (
  userDetails: O.Option<UserDetails>,
  pageLayout: PageLayout,
  clientClassification: ClientClassification)
=> (renderedPage: E.Either<ErrorPageBodyViewModel, HtmlPage>)
=> HtmlResponse;

export const constructHtmlResponse: ConstructHtmlResponse = (
  userDetails,
  pageLayout,
  clientClassification,
) => (renderedPage) => pipe(
  renderedPage,
  E.fold(
    toErrorResponse(userDetails, clientClassification),
    pageToSuccessResponse(userDetails, pageLayout, clientClassification),
  ),
);

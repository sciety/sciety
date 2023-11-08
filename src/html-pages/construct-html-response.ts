import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import * as DE from '../types/data-error';
import { HtmlPage } from './html-page';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { UserDetails } from '../types/user-details';
import { PageLayout } from './page-layout';
import { renderOopsMessage } from './render-oops-message';
import { CompleteHtmlDocument } from './complete-html-document';
import { wrapInHtmlDocument } from './wrap-in-html-document';
import { ClientClassification } from '../shared-components/head';

const toErrorResponse = (user: O.Option<UserDetails>) => (error: ErrorPageBodyViewModel): HtmlResponse => pipe(
  renderOopsMessage(error.message),
  (content) => ({
    title: 'Error',
    content,
  }),
  standardPageLayout(user),
  wrapInHtmlDocument(user, { title: 'Error' }),
  (document) => ({
    document,
    error: O.some(error.type),
  }),
);

const pageToSuccessResponse = (
  user: O.Option<UserDetails>,
  pageLayout: PageLayout,
) => (page: HtmlPage): HtmlResponse => ({
  document: pipe(
    page,
    pageLayout(user),
    wrapInHtmlDocument(user, page),
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
  clientClassification?: ClientClassification)
=> (renderedPage: E.Either<ErrorPageBodyViewModel, HtmlPage>)
=> HtmlResponse;

export const constructHtmlResponse: ConstructHtmlResponse = (
  userDetails,
  pageLayout,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clientClassification,
) => (renderedPage) => pipe(
  renderedPage,
  E.fold(
    toErrorResponse(userDetails),
    pageToSuccessResponse(userDetails, pageLayout),
  ),
);

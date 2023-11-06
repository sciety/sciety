import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment, HtmlFragment } from '../types/html-fragment';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import * as DE from '../types/data-error';
import { HtmlPage } from '../types/html-page';
import { RenderPageError } from '../types/render-page-error';
import { UserDetails } from '../types/user-details';
import { PageLayout } from './page-layout';
import { renderErrorPage } from './render-error-page';

const toErrorResponse = (user: O.Option<UserDetails>) => (error: RenderPageError) => pipe(
  renderErrorPage(error.message),
  (content) => ({
    title: 'Error',
    content,
  }),
  standardPageLayout(user),
  toHtmlFragment,
  (document) => ({
    document,
    error: O.some(error.type),
  }),
);

const pageToSuccessResponse = (user: O.Option<UserDetails>, pageLayout: PageLayout) => (page: HtmlPage) => ({
  document: toHtmlFragment(pageLayout(user)(page)),
  error: O.none,
});

export type HtmlResponse = {
  document: HtmlFragment,
  error: O.Option<DE.DataError>,
};

type ConstructHtmlResponse = (userDetails: O.Option<UserDetails>, pageLayout: PageLayout)
=> (renderedPage: E.Either<RenderPageError, HtmlPage>)
=> HtmlResponse;

export const constructHtmlResponse: ConstructHtmlResponse = (userDetails, pageLayout) => (renderedPage) => pipe(
  renderedPage,
  E.fold(
    toErrorResponse(userDetails),
    pageToSuccessResponse(userDetails, pageLayout),
  ),
);

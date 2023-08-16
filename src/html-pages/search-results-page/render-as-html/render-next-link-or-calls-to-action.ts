import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { renderPaginationControls } from '../../../shared-components/pagination';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';

export type SearchParameters = {
  query: string,
  evaluatedOnly: boolean,
  category: 'articles' | 'groups',
  nextCursor: O.Option<string>,
  pageNumber: number,
};

export const renderNextLinkOrCallsToAction = ({
  category, query, evaluatedOnly, nextCursor, pageNumber,
}: SearchParameters): HtmlFragment => pipe(
  nextCursor,
  O.map((cursor) => `/search?query=${encodeURIComponent(query)}&category=${category}&cursor=${encodeURIComponent(cursor)}${evaluatedOnly ? '&evaluatedOnly=true' : ''}&`),
  O.fold(
    () => '<footer class="search-results__footer">Not what you were hoping for? Try our <a href="https://blog.sciety.org/sciety-search/">advanced search tips</a>, or <a href="/contact-us">leave us a suggestion</a>.</footer>',
    (basePath) => renderPaginationControls({ basePath, nextPage: O.some(pageNumber) }),
  ),
  toHtmlFragment,
);

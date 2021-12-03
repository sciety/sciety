import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { paginationControls } from '../shared-components/pagination-controls';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type SearchParameters = {
  query: string,
  category: string,
  nextCursor: O.Option<string>,
  pageNumber: number,
};

export const nextLink = ({
  category, query, nextCursor, pageNumber,
}: SearchParameters): HtmlFragment => pipe(
  nextCursor,
  O.map((cursor) => `/search?query=${encodeURIComponent(query)}&category=${category}&cursor=${encodeURIComponent(cursor)}&`),
  O.fold(
    () => '',
    (basePath) => paginationControls(basePath, O.some(pageNumber)),
  ),
  toHtmlFragment,
);

import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
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
  O.map((cursor) => `/search?query=${htmlEscape(query)}&category=${category}&cursor=${encodeURIComponent(cursor)}&page=${pageNumber}`),
  O.map(paginationControls),
  O.getOrElse(constant('')),
  toHtmlFragment,
);

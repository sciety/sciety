import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderNextLink = (category: string, query: string, nextPageNumber: number) => (nextCursor: string): HtmlFragment => toHtmlFragment(`
  <div class="search-results__link_container">
    <a href="/search?query=${htmlEscape(query)}&category=${category}&cursor=${htmlEscape(nextCursor)}&page=${nextPageNumber}" class="search-results__next_link">Next</a>
  </div>
`);

type SearchParameters = {
  query: string,
  category: string,
  nextCursor: O.Option<string>,
  nextPageNumber: number,
};

export const nextLink = ({
  category, query, nextCursor, nextPageNumber,
}: SearchParameters): HtmlFragment => pipe(
  nextCursor,
  O.map(renderNextLink(category, query, nextPageNumber)),
  O.getOrElse(constant('')),
  toHtmlFragment,
);

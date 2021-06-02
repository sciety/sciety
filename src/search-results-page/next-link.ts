import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import { constant, pipe } from 'fp-ts/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderNextLink = (category: string, query: string) => (nextCursor: string): HtmlFragment => toHtmlFragment(`
  <a href="/search?query=${htmlEscape(query)}&category=${category}&cursor=${htmlEscape(nextCursor)}" class="search-results__next_link">Next</a>
`);

type SearchParameters = {
  query: string,
  category: string,
  nextCursor: O.Option<string>,
};

export const nextLink = ({ category, query, nextCursor }: SearchParameters): HtmlFragment => pipe(
  nextCursor,
  O.map(renderNextLink(category, query)),
  O.getOrElse(constant('')),
  toHtmlFragment,
);

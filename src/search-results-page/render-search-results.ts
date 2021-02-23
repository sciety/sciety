import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { RenderSearchResult, SearchResult } from './render-search-result';
import { templateListItems } from '../shared-components';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type SearchResults = {
  items: ReadonlyArray<SearchResult>,
  total: number,
};

type RenderListIfNecessary = (articles: ReadonlyArray<HtmlFragment>) => string;

const renderListIfNecessary: RenderListIfNecessary = flow(
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (articles) => `
      <ul class="search-results-list" role="list">
        ${templateListItems(articles, 'search-results-list__item')}
      </ul>
    `,
  ),
);

export const renderSearchResults = (
  renderSearchResult: RenderSearchResult,
) => (
  searchResults: SearchResults,
): HtmlFragment => (
  pipe(
    searchResults.items,
    RA.map(renderSearchResult),
    renderListIfNecessary,
    (searchResultsList) => `
      <p class="search-results__summary">Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
      ${searchResultsList}
    `,
    toHtmlFragment,
  )
);

import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, pipe } from 'fp-ts/function';
import { ItemViewModel, RenderSearchResult } from './render-search-result';
import { templateListItems } from '../shared-components';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type SearchResults = {
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  availableMatches: number,
};

const renderListIfNecessary = (articles: ReadonlyArray<HtmlFragment>) => pipe(
  articles,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
);

export const renderSearchResults = (
  renderSearchResult: RenderSearchResult,
) => (
  query: string,
) => (
  searchResults: SearchResults,
): HtmlFragment => (
  pipe(
    searchResults.itemsToDisplay,
    RA.map(renderSearchResult),
    renderListIfNecessary,
    (searchResultsList) => `
      <p class="search-results__summary">Showing ${searchResults.itemsToDisplay.length} of ${searchResults.availableMatches} results for <span class="search-results__query">${htmlEscape(query)}</span></p>
      ${searchResultsList}
    `,
    toHtmlFragment,
  )
);

import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, flow, pipe } from 'fp-ts/function';
import { ArticleSearchResult, RenderSearchResult, SearchResult } from './render-search-result';
import { templateListItems } from '../shared-components';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type SearchResults = {
  items: ReadonlyArray<Omit<ArticleSearchResult, '_tag'>>,
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

const addPeerJHardcodedResult = (
  query: string,
) => (
  items: ReadonlyArray<SearchResult>,
): ReadonlyArray<SearchResult> => {
  if (query === 'peerj') {
    const hardcodedSearchResult = {
      _tag: 'Group' as const,
      link: '/groups/53ed5364-a016-11ea-bb37-0242ac130002',
      name: 'PeerJ',
    };
    return RA.cons<SearchResult>(hardcodedSearchResult)(items);
  }
  return items;
};

export const renderSearchResults = (
  renderSearchResult: RenderSearchResult,
) => (
  query: string,
) => (
  searchResults: SearchResults,
): HtmlFragment => (
  pipe(
    searchResults.items,
    RA.map((item) => ({ ...item, _tag: 'Article' as const })),
    addPeerJHardcodedResult(query),
    RA.map(renderSearchResult),
    renderListIfNecessary,
    (searchResultsList) => `
      <p class="search-results__summary">Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
      ${searchResultsList}
    `,
    toHtmlFragment,
  )
);

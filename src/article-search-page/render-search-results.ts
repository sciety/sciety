import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import { RenderSearchResult, SearchResult } from './render-search-result';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type FindArticles = (query: string) => TE.TaskEither<'unavailable', {
  items: Array<SearchResult>,
  total: number,
}>;

export type RenderSearchResults = (query: string) => TE.TaskEither<'unavailable', HtmlFragment>;

type SearchResults = {
  items: Array<SearchResult>,
  total: number,
};

type RenderListIfNecessary = (articles: ReadonlyArray<HtmlFragment>) => string;

const renderListIfNecessary = (query: string): RenderListIfNecessary => flow(
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (articles) => {
      const groupQueryResult = query === 'peerj' ? '<li class="search-results-list__item"><a href="/groups/53ed5364-a016-11ea-bb37-0242ac130002">PeerJ</a></li>' : '';
      return `
        <ul class="search-results-list" role="list">
          ${groupQueryResult}
          ${templateListItems(articles, 'search-results-list__item')}
        </ul>
      `;
    },
  ),
);

const renderSearchResults = (
  renderSearchResult: RenderSearchResult,
) => (
  query:string,
) => (
  searchResults: SearchResults,
) => (
  pipe(
    searchResults.items,
    T.traverseArray(renderSearchResult),
    T.map(renderListIfNecessary(query)),
    T.map((searchResultsList) => `
      <p class="search-results__summary">Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
      ${searchResultsList}
    `),
  )
);

export const createRenderSearchResults = (
  findArticles: FindArticles,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => (query) => pipe(
  query,
  findArticles,
  TE.chainW(
    flow(
      renderSearchResults(renderSearchResult)(query),
      TE.rightTask,
    ),
  ),
  TE.map(toHtmlFragment),
);

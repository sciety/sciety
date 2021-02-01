import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
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

const renderListIfNecessary = (articles: ReadonlyArray<HtmlFragment>): string => {
  if (articles.length === 0) {
    return '';
  }

  return `
      <ul class="search-results-list" role="list">
        ${templateListItems(articles, 'search-results-list__item')}
      </ul>
    `;
};

const renderSearchResults = (renderSearchResult: RenderSearchResult) => (searchResults: SearchResults) => (
  pipe(
    searchResults.items,
    T.traverseArray(renderSearchResult),
    T.map(renderListIfNecessary),
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
      renderSearchResults(renderSearchResult),
      TE.rightTask,
    ),
  ),
  TE.map(toHtmlFragment),
);

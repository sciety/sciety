import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { flow, pipe } from 'fp-ts/lib/function';
import { RenderSearchResult, SearchResult } from './render-search-result';
import templateListItems from '../shared-components/list-items';
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
      <ul class="ui relaxed divided items" role="list">
        ${templateListItems(articles)}
      </ul>
    `;
};

const renderSearchResults = (renderSearchResult: RenderSearchResult) => (searchResults: SearchResults) => (
  pipe(
    searchResults.items,
    T.traverseArray(renderSearchResult),
    T.map(renderListIfNecessary),
    T.map((searchResultsList) => `
      <p>Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
      ${searchResultsList}
    `),
  )
);

export default (
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

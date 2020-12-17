import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { RenderSearchResult, SearchResult } from './render-search-result';
import templateListItems from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type FindArticles = (query: string) => T.Task<{
  items: Array<SearchResult>;
  total: number;
}>;

export type RenderSearchResults = (query: string) => T.Task<HtmlFragment>;

export default (
  findArticles: FindArticles,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => (
  (query) => async () => {
    const searchResults = await pipe(
      query,
      findArticles,
    )();
    const articles = await Promise.all(searchResults.items.map(async (item) => renderSearchResult(item)()));
    let searchResultsList = '';
    if (articles.length) {
      searchResultsList = toHtmlFragment(`
        <ul class="ui relaxed divided items" role="list">
          ${templateListItems(articles)}
        </ul>
      `);
    }

    return toHtmlFragment(`
      <p>Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
      ${searchResultsList}
    `);
  }
);

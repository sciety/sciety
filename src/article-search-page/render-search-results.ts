import { RenderSearchResult, SearchResult } from './render-search-result';
import templateListItems from '../templates/list-items';

export type FindArticles = (query: string) => Promise<{
  items: Array<SearchResult>;
  total: number;
}>;

export type RenderSearchResults = (query: string) => Promise<string>;

export default (
  findArticles: FindArticles,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => (
  async (query) => {
    const searchResults = await findArticles(query);
    const articles = await Promise.all(searchResults.items.map(renderSearchResult));
    let searchResultsList = '';
    if (articles.length) {
      searchResultsList = `
        <ul class="ui relaxed divided items">
          ${templateListItems(articles)}
        </ul>
      `;
    }

    return `
      <p>Showing ${searchResults.items.length} of ${searchResults.total} results.</p>
      ${searchResultsList}
    `;
  }
);

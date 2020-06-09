import { RenderSearchResult } from './render-search-result';
import createSearchEuropePmc from './search-europe-pmc';
import templateListItems from '../templates/list-items';

export type GetJson = (uri: string) => Promise<object>;

type RenderSearchResults = (query: string) => Promise<string>;

export default (
  getJson: GetJson,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => (
  async (query) => {
    const findArticles = createSearchEuropePmc(getJson);
    const europePmcSearchResults = await findArticles(query);
    const articles = await Promise.all(europePmcSearchResults.items.map(renderSearchResult));
    let searchResultsList = '';
    if (articles.length) {
      searchResultsList = `
        <ul class="ui relaxed divided items">
          ${templateListItems(articles)}
        </ul>
      `;
    }

    return `
      <p>${europePmcSearchResults.total} search results.</p>
      ${searchResultsList}
    `;
  }
);

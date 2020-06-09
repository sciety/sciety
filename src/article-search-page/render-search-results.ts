import { RenderSearchResult, SearchResult } from './render-search-result';
import createLogger from '../logger';
import templateListItems from '../templates/list-items';

export type GetJson = (uri: string) => Promise<object>;

interface EuropePmcQueryResponse {
  hitCount: number;
  resultList: {
    result: Array<{
      doi: string;
      title: string;
      authorString: string;
    }>;
  };
}

type RenderSearchResults = (query: string) => Promise<string>;

const log = createLogger('article-search-page:render-search-results');

type GetSearchResults = (query: string) => Promise<{
  items: Array<SearchResult>;
  total: number;
}>;

const createFetchEuropePmcSearchResults = (getJson: GetJson): GetSearchResults => (
  async (query) => {
    const uri = 'https://www.ebi.ac.uk/europepmc/webservices/rest/search'
      + `?query=${query}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const data = await getJson(uri) as EuropePmcQueryResponse;
    log(data);
    return {
      items: data.resultList.result,
      total: data.hitCount,
    };
  }
);

export default (
  getJson: GetJson,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => (
  async (query) => {
    const fetchEuropePmcSearchResults = createFetchEuropePmcSearchResults(getJson);
    const europePmcSearchResults = await fetchEuropePmcSearchResults(query);
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

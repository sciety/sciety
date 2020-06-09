import { RenderSearchResult } from './render-search-result';
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

export default (
  getJson: GetJson,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => (
  async (query) => {
    const uri = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const data = await getJson(uri) as EuropePmcQueryResponse;
    log(data);
    const articles = await Promise.all(data.resultList.result.map(renderSearchResult));
    let searchResultsList = '';
    if (articles.length) {
      searchResultsList = `
        <ul class="ui relaxed divided items">
          ${templateListItems(articles)}
        </ul>
      `;
    }

    return `
      <p>${data.hitCount} search results.</p>
      ${searchResultsList}
    `;
  }
);

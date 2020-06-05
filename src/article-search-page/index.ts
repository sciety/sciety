import axios from 'axios';
import { Middleware } from 'koa';
import createLogger from '../logger';
import templateListItems from '../templates/list-items';

type RenderSearchResults = (query: string) => Promise<string>;

export type GetJson = (uri: string) => Promise<object>;

interface SearchResult {
  doi: string;
  title: string;
}

interface EuropePmcQueryResponse {
  hitCount: number;
  resultList: { result: Array<SearchResult> };
}

export const createRenderSearchResults = (getJson: GetJson): RenderSearchResults => (
  async (query) => {
    const uri = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const data = await getJson(uri) as EuropePmcQueryResponse;
    const log = createLogger('article-search-page:index');
    log(data);
    const articles = data.resultList.result.map((result: SearchResult) => (
      `<a href="/articles/${result.doi}">${result.title}</a>`
    ));
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

export default (): Middleware => {
  const getJson: GetJson = async (uri) => {
    const response = await axios.get(uri);
    return response.data;
  };
  const renderSearchResults = createRenderSearchResults(getJson);
  return async (ctx, next) => {
    ctx.response.body = `
      <h1 class="ui header">Search results</h1>
      ${await renderSearchResults(ctx.request.query.query)}
    `;

    await next();
  };
};

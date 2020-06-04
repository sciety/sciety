import axios from 'axios';
import { Middleware } from 'koa';
import createLogger from '../logger';
import templateListItems from '../templates/list-items';

interface SearchResult {
  doi: string;
  title: string;
}

type RenderSearchResults = (query: string) => Promise<string>;

export type MakeHttpRequest = (uri: string) => Promise<object>;

export const createRenderSearchResults = (makeHttpRequest: MakeHttpRequest): RenderSearchResults => (
  async (query) => {
    const uri = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const data = await makeHttpRequest(uri) as { resultList: { result: Array<SearchResult>}};
    const log = createLogger('article-search-page:index');
    log(data);
    const articles = data.resultList.result.map((result: SearchResult) => (
      `<a href="/articles/${result.doi}">${result.title}</a>`
    ));
    return `
      <ul>
        ${templateListItems(articles)}
      </ul>
    `;
  }
);

export default (): Middleware => {
  const makeHttpRequest: MakeHttpRequest = async (uri) => {
    const response = await axios.get(uri);
    return response.data;
  };
  const renderSearchResults = createRenderSearchResults(makeHttpRequest);
  return async (ctx, next) => {
    ctx.response.body = `
      <h1>Search results</h1>
      ${await renderSearchResults(ctx.request.query.doi)}
    `;

    await next();
  };
};

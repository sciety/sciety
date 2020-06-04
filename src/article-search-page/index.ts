import axios from 'axios';
import { Context, Middleware, Next } from 'koa';
import createLogger from '../logger';
import templateListItems from '../templates/list-items';

interface SearchResult {
  doi: string;
  title: string;
}

export const renderSearchResults = async (query: string): Promise<string> => {
  const uri = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${query}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
  const response = await axios.get(uri);
  const log = createLogger('article-search-page:index');
  log(response.data);
  const articles = response.data.resultList.result.map((result: SearchResult) => (
    `<a href="/articles/${result.doi}">${result.title}</a>`
  ));
  return `
    <ul>
      ${templateListItems(articles)}
    </ul>
  `;
};

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.response.body = `
      <h1>Search results</h1>
      ${await renderSearchResults(ctx.request.query.doi)}
    `;

    await next();
  }
);

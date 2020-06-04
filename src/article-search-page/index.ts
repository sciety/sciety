import axios from 'axios';
import { Context, Middleware, Next } from 'koa';
import createLogger from '../logger';
import templateListItems from '../templates/list-items';

interface SearchResult {
  doi: string;
  title: string;
}

export default (): Middleware => {
  const log = createLogger('article-search-page:index');
  return async (ctx: Context, next: Next): Promise<void> => {
    const uri = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${ctx.request.query.doi}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const response = await axios.get(uri);
    log(response.data);
    const articles = response.data.resultList.result.map((result: SearchResult) => (
      `<a href="/articles/${result.doi}">${result.title}</a>`
    ));
    ctx.response.body = `
      <h1>Search results</h1>
      <ul>
        ${templateListItems(articles)}
      </ul>
    `;

    await next();
  };
};

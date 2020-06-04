import axios from 'axios';
import { Context, Middleware, Next } from 'koa';
import createLogger from '../logger';


export default (): Middleware => {
  const log = createLogger('article-redirect:index');
  return async (ctx: Context, next: Next): Promise<void> => {
    const uri = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${ctx.request.query.doi}%20PUBLISHER%3A%22bioRxiv%22&format=json&pageSize=10`;
    const response = await axios.get(uri);
    log(response.data);
    ctx.response.body = `
      <h1>Search results</h1>
      <ul>
        <li>
          <a href="/articles/${ctx.request.query.doi}">Article found</a>
        </li>
      </ul>
    `;

    await next();
  };
};

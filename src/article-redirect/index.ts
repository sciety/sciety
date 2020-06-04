import { PERMANENT_REDIRECT } from 'http-status-codes';
import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.response.body = `
      <h1>Search results</h1>
      <ul>
        <li>
          <a href="/articles/${ctx.request.query.doi}">Article found</a>
        </li>
      </ul>
    `;

    await next();
  }
);

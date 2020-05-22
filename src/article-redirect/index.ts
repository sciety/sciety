import { PERMANENT_REDIRECT } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.status = PERMANENT_REDIRECT;
    ctx.response.redirect(`/articles/${ctx.params.doi}`);

    await next();
  }
);

import { PERMANENT_REDIRECT } from 'http-status-codes';
import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.response.status = PERMANENT_REDIRECT;
    ctx.response.redirect('/articles/10.1101/2000.1234');

    await next();
  }
);

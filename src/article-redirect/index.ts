import { PERMANENT_REDIRECT } from 'http-status-codes';
import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.response.status = PERMANENT_REDIRECT;

    await next();
  }
);

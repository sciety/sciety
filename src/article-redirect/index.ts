import { Middleware, Next, Context } from 'koa';
import { PERMANENT_REDIRECT } from 'http-status-codes';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.response.status = PERMANENT_REDIRECT;

    await next();
  }
);

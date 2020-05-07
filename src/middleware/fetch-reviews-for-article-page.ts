import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    await next();
  }
);

import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';

declare module 'koa' {
  interface BaseContext {
    prc: {
      [key: string]: any;
    };
  }
}

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.prc = {};
    await next();
  }
);

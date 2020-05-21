import { Context, Middleware, Next } from 'koa';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    await next();
  }
);

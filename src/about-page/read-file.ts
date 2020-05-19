import { Context, Middleware, Next } from 'koa';
import fetchStaticFile from '../api/fetch-static-file';

export default (filename: string): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.markdown = fetchStaticFile(filename);

    await next();
  }
);

import { Context, Middleware, Next } from 'koa';
import { FetchStaticFile } from '../infrastructure/fetch-static-file';

export default (filename: string, fetchStaticFile: FetchStaticFile): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.markdown = fetchStaticFile(filename);

    await next();
  }
);

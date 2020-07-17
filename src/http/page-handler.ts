import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { Adapters } from '../infrastructure/adapters';

export type RenderPage = (params: Record<string, string>) => Promise<string>;

export default (
  adapters: Adapters,
  createRenderPage: (adapters: Adapters) => RenderPage,
): Middleware => {
  const renderPage = createRenderPage(adapters);
  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const params = {
      ...ctx.params,
      ...ctx.query,
    };
    ctx.response.body = await renderPage(params);
    await next();
  };
};

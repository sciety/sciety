import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import applyStandardPageLayout from '../templates/apply-standard-page-layout';

export type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
}) => Promise<string>;

export default (
  renderPage: RenderPage,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const params = {
      ...ctx.params,
      ...ctx.query,
    };
    ctx.response.type = 'html';
    ctx.response.body = applyStandardPageLayout(await renderPage(params));
    await next();
  }
);

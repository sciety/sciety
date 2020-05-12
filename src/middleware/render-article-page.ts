import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import templateArticlePage from '../templates/article-page';

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = templateArticlePage(ctx.state.articlePage);

    await next();
  }
);

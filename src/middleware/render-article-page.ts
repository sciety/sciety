import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import templateArticlePage from '../templates/article-page';
import { EditorialCommunity } from '../types/editorial-community';

export default (editorialCommunities: Array<EditorialCommunity>): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = templateArticlePage(ctx.state.articlePage, editorialCommunities);

    await next();
  }
);

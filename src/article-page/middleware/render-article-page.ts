import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import renderPage from '../render-page';

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.state.articlePage, editorialCommunities);

    await next();
  }
);

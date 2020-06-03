import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import templateArticlePage from '../templates/article-page';

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await templateArticlePage(ctx.state.articlePage, editorialCommunities);

    await next();
  }
);

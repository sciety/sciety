import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import templateArticlePage from '../../templates/article-page';
import EditorialCommunityRepository from '../../types/editorial-community-repository';

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = templateArticlePage(ctx.state.articlePage, editorialCommunities);

    await next();
  }
);

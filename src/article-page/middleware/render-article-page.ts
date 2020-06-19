import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import renderPage from '../render-page';
import { GetArticleDetails, GetCommentCount } from '../render-page-header';

export default (
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: GetArticleDetails,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(
      ctx.state.articleDoi,
      ctx.state.articlePage,
      editorialCommunities,
      getCommentCount,
      fetchArticle,
    );

    await next();
  }
);

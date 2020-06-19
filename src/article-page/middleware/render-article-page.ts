import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { FetchCrossrefArticle } from '../../api/fetch-crossref-article';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import renderPage from '../render-page';
import { GetCommentCount } from '../render-page-header';

export default (
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: FetchCrossrefArticle,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(
      ctx.state.articleDoi,
      ctx.state.articlePage,
      editorialCommunities,
      getCommentCount,
      fetchArticle,
      fetchArticle,
    );

    await next();
  }
);

import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { FetchCrossrefArticle } from '../../api/fetch-crossref-article';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import ReviewReferenceRepository from '../../types/review-reference-repository';
import renderPage, { FetchReviews } from '../render-page';
import { GetCommentCount } from '../render-page-header';

export default (
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: FetchCrossrefArticle,
  fetchReviews: FetchReviews,
  reviewReferenceRepository: ReviewReferenceRepository,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(
      ctx.state.articleDoi,
      fetchReviews,
      editorialCommunities,
      getCommentCount,
      fetchArticle,
      fetchArticle,
      reviewReferenceRepository,
    );

    await next();
  }
);

import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { FetchCrossrefArticle } from '../../api/fetch-crossref-article';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import ReviewReferenceRepository from '../../types/review-reference-repository';
import renderPage, { FetchReviews } from '../render-page';
import { GetCommentCount } from '../render-page-header';
import validateBiorxivDoi from '../validate-biorxiv-doi';

export default (
  editorialCommunities: EditorialCommunityRepository,
  getCommentCount: GetCommentCount,
  fetchArticle: FetchCrossrefArticle,
  fetchReviews: FetchReviews,
  reviewReferenceRepository: ReviewReferenceRepository,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi = validateBiorxivDoi(ctx.params.doi);
    ctx.response.body = await renderPage(
      doi,
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

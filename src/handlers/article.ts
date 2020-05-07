import { SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchDatasetError } from '../api/fetch-dataset';
import Doi from '../data/doi';
import createLogger from '../logger';
import { Article } from '../types/article';
import { Review } from '../types/review';
import { ReviewedArticle } from '../types/reviewed-article';

const log = createLogger('handler:article');

export default (): Middleware => {
  const fetchReviewedArticle = async (
    fetchedArticle: Promise<Article>,
    fetchedReviews: Promise<Array<Review>>,
  ): Promise<ReviewedArticle> => {
    const [article, reviews] = await Promise.all([
      fetchedArticle,
      fetchedReviews,
    ]);

    return {
      article,
      reviews,
    };
  };

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.prc.articleDoi;

    try {
      ctx.prc.reviewedArticle = await fetchReviewedArticle(ctx.prc.article, ctx.prc.reviews);
    } catch (e) {
      if (e instanceof FetchDatasetError) {
        log(`Failed to load article ${doi}: (${e})`);
        ctx.response.status = SERVICE_UNAVAILABLE;
        ctx.response.body = 'Article temporarily unavailable. Please try refreshing.';
        return;
      }
      log(`Article ${doi} not found: (${e})`);
      throw new NotFound(`${doi} not found`);
    }

    await next();
  };
};

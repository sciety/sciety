import { SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import { FetchArticle } from '../api/fetch-article';
import { FetchDatasetError } from '../api/fetch-dataset';
import { FetchReview } from '../api/fetch-review';
import Doi from '../data/doi';
import createLogger from '../logger';
import ReviewReferenceRepository from '../types/review-reference-repository';
import { ReviewedArticle } from '../types/reviewed-article';

const log = createLogger('handler:article');

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchArticle: FetchArticle,
  fetchReview: FetchReview,
): Middleware => {
  const fetchReviewedArticle = async (doi: Doi): Promise<ReviewedArticle> => {
    const [article, reviews] = await Promise.all([
      fetchArticle(doi),
      Promise.all(reviewReferenceRepository.findReviewDoisForArticleDoi(doi).map(fetchReview)),
    ]);

    return {
      article,
      reviews,
    };
  };

  return async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.prc.articleDoi;

    try {
      ctx.prc.reviewedArticle = await fetchReviewedArticle(doi);
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

import { Middleware, RouterContext } from '@koa/router';
import { NotFound, ServiceUnavailable } from 'http-errors';
import { Next } from 'koa';
import { FetchDatasetError } from '../api/fetch-dataset';
import { FetchReview } from '../api/fetch-review';
import Doi from '../data/doi';
import createLogger from '../logger';
import ReviewReferenceRepository from '../types/review-reference-repository';

const log = createLogger('middleware:fetch-reviews-for-article-page');

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchReview: FetchReview,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.prc.articleDoi;

    ctx.prc.reviews = Promise.all(reviewReferenceRepository.findReviewDoisForArticleDoi(doi).map(fetchReview))
      .catch((error) => {
        log(`Failed to load reviews for article ${doi}: (${error})`);

        if (error instanceof FetchDatasetError) {
          throw new ServiceUnavailable('Article temporarily unavailable. Please try refreshing.');
        }

        throw new NotFound(`${doi} not found`);
      });


    await next();
  }
);

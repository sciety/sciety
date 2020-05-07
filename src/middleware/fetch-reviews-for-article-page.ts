import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { FetchReview } from '../api/fetch-review';
import Doi from '../data/doi';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
  fetchReview: FetchReview,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const doi: Doi = ctx.prc.articleDoi;

    ctx.prc.reviews = Promise.all(reviewReferenceRepository.findReviewDoisForArticleDoi(doi).map(fetchReview));

    await next();
  }
);

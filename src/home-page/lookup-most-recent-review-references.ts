import { Context, Middleware, Next } from 'koa';
import ReviewReferenceRepository from '../types/review-reference-repository';

const limit = 5;

export default (reviewReferenceRepository: ReviewReferenceRepository): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.mostRecentReviewReferences = reviewReferenceRepository.orderByAddedDescending(limit);

    await next();
  }
);

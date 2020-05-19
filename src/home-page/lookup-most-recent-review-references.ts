import { Context, Middleware, Next } from 'koa';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (reviewReferenceRepository: ReviewReferenceRepository): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.mostRecentReviewReferences = reviewReferenceRepository.orderByAddedDescending();

    await next();
  }
);

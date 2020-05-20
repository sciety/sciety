import { Context, Middleware, Next } from 'koa';
import ReviewReferenceRepository from '../types/review-reference-repository';

const limit = 5;

export default (reviewReferenceRepository: ReviewReferenceRepository): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.mostRecentReviewReferences = Array.from(reviewReferenceRepository).sort((a, b) => (
      b.added.getTime() - a.added.getTime()
    )).slice(0, limit);

    await next();
  }
);

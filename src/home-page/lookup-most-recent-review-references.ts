import { Context, Middleware, Next } from 'koa';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (reviewReferenceRepository: ReviewReferenceRepository, limit = 5): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.mostRecentReviewReferences = Array.from(reviewReferenceRepository).sort((a, b) => (
      b.added.getTime() - a.added.getTime()
    )).slice(0, limit);

    await next();
  }
);

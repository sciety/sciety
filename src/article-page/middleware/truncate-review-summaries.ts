import { Context, Middleware, Next } from 'koa';
import { ReviewViewModel } from '../types/article-page-view-model';

export default (maxChars: number): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.articlePage.reviews = ctx.state.articlePage.reviews.map((review: ReviewViewModel) => ({
      ...review,
      summary: review.summary.substring(0, maxChars),
    }));
    await next();
  }
);

import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import { ArticlePage } from '../templates/article-page';

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const [article, reviews] = await Promise.all([
      ctx.state.article,
      ctx.state.reviews,
    ]);

    ctx.state.articlePage = {
      article,
      reviews,
    } as ArticlePage;

    await next();
  }
);

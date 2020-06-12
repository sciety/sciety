import { Context, Middleware, Next } from 'koa';
import { FetchArticle } from '../../api/fetch-article';

export default (
  fetchArticle: FetchArticle,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { reviewedArticleVersionDois } = ctx.state;

    ctx.state.fetchedArticles = Promise.all(reviewedArticleVersionDois.map(fetchArticle));

    await next();
  }
);

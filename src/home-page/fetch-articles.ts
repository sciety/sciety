import { Context, Middleware, Next } from 'koa';
import { FetchArticle } from '../api/fetch-article';
import Doi from '../data/doi';
import ReviewReference from '../types/review-reference';

export default (
  fetchArticle: FetchArticle,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const articleVersionDois = [...new Set<Doi>(ctx.state.mostRecentReviews
      .map((reviewReference: ReviewReference) => reviewReference.articleVersionDoi))];

    ctx.state.fetchedArticles = Promise.all(articleVersionDois.map(fetchArticle)).then((fetchedArticles) => (
      fetchedArticles.reduce((fetchedArticlesMap, fetchedArticle) => ({
        ...fetchedArticlesMap, [fetchedArticle.doi.toString()]: fetchedArticle,
      }), {})
    ));

    await next();
  }
);

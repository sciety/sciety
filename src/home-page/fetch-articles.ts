import { Context, Middleware, Next } from 'koa';
import { FetchArticle } from '../api/fetch-article';
import Doi from '../data/doi';

export default (
  fetchArticle: FetchArticle,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const articleVersionDois = [
      new Doi('10.1101/833392'),
      new Doi('10.1101/642017'),
      new Doi('10.1101/615682'),
      new Doi('10.1101/629618'),
      new Doi('10.1101/600445'),
    ];

    ctx.state.fetchedArticles = Promise.all(articleVersionDois.map(fetchArticle)).then((fetchedArticles) => (
      fetchedArticles.reduce((fetchedArticlesMap, fetchedArticle) => ({
        ...fetchedArticlesMap, [fetchedArticle.doi.toString()]: fetchedArticle,
      }), {})
    ));

    await next();
  }
);

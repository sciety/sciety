import { Context, Middleware, Next } from 'koa';
import { Article } from '../types/article';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { editorialCommunity, fetchedArticles } = ctx.state;
    const articles: Array<Article> = await fetchedArticles;
    const teasers = articles.map((article) => ({
      doi: article.doi,
      title: article.title,
    }));

    ctx.state.viewModel = {
      name: editorialCommunity.name,
      description: editorialCommunity.description,
      teasers,
    };

    await next();
  }
);

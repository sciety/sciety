import { Context, Middleware, Next } from 'koa';
import templateHeader from './templates/header';
import templateReviewedArticles from './templates/reviewed-articles';
import Doi from '../data/doi';
import { FetchedArticle } from '../types/fetched-article';

interface ReviewedArticle {
  doi: Doi;
  title: string;
}

interface ViewModel {
  name: string;
  description: string;
  reviewedArticles: Array<ReviewedArticle>;
}

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { editorialCommunity, fetchedArticles } = ctx.state;
    const articles: Array<FetchedArticle> = await fetchedArticles;
    const reviewedArticles = articles.map((article) => ({
      doi: article.doi,
      title: article.title,
    }));

    const viewModel = {
      name: editorialCommunity.name,
      description: editorialCommunity.description,
      reviewedArticles,
    };

    ctx.response.body = templateHeader(viewModel);
    ctx.response.body += templateReviewedArticles(viewModel.reviewedArticles);

    await next();
  }
);

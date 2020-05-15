import { Context, Middleware, Next } from 'koa';
import templateHeader from './templates/header';
import templateReviewedArticles from './templates/reviewed-articles';
import Doi from '../data/doi';

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
    const { viewModel } = ctx.state;

    ctx.response.body = templateHeader(viewModel);
    ctx.response.body += templateReviewedArticles(viewModel.reviewedArticles);

    await next();
  }
);

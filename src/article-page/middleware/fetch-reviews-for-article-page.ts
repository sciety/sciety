import { NotFound, ServiceUnavailable } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import { FetchDatasetError } from '../../api/fetch-dataset';
import Doi from '../../data/doi';
import { ArticlePageViewModel } from '../types/article-page-view-model';

export interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export type GetReviews = (doi: Doi) => Promise<Array<Review>>;

export default (
  fetchReviews: GetReviews,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const doi: Doi = ctx.state.articleDoi;

    const reviews = await fetchReviews(doi)
      .catch((error) => {
        if (error instanceof FetchDatasetError) {
          throw new ServiceUnavailable('Article temporarily unavailable. Please try refreshing.');
        }
        throw new NotFound(`${doi} not found`);
      });

    ctx.state.articlePage = {
      reviews,
    } as ArticlePageViewModel;

    await next();
  }
);

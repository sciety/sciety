import { Context, Middleware, Next } from 'koa';
import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import { ArticlePageViewModel } from '../types/article-page-view-model';

interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
}

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const reviews = await ctx.state.reviews;

    const reviewSummaries = reviews.map((review: Review) => {
      const editorialCommunity = editorialCommunities.lookup(review.editorialCommunityId);
      return {
        ...review,
        editorialCommunityName: editorialCommunity ? editorialCommunity.name : 'Unknown',
      };
    });

    ctx.state.articlePage = {
      reviews: reviewSummaries,
    } as ArticlePageViewModel;

    await next();
  }
);

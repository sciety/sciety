import { Context, Middleware, Next } from 'koa';
import Doi from '../data/doi';
import { ArticlePage } from '../templates/article-page';
import EditorialCommunityRepository from '../types/editorial-community-repository';

interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
}

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const [article, reviews] = await Promise.all([
      ctx.state.article,
      ctx.state.reviews,
    ]);

    const reviewSummaries = reviews.map((review: Review) => {
      const editorialCommunity = editorialCommunities.lookup(review.editorialCommunityId);
      return {
        ...review,
        editorialCommunityName: editorialCommunity ? editorialCommunity.name : 'Unknown',
      };
    });

    ctx.state.articlePage = {
      article,
      reviews: reviewSummaries,
    } as ArticlePage;

    await next();
  }
);

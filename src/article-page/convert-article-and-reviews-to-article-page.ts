import { Context, Middleware, Next } from 'koa';
import Doi from '../data/doi';
import { ArticlePage } from '../templates/article-page';
import { EditorialCommunity } from '../types/editorial-community';

interface Review {
  publicationDate: Date;
  summary: string;
  doi: Doi;
  editorialCommunityId: string;
  editorialCommunityName: string;
}

export default (editorialCommunities: Array<EditorialCommunity>): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const [article, reviews] = await Promise.all([
      ctx.state.article,
      ctx.state.reviews,
    ]);

    const reviewSummaries = reviews.map((review: Review) => {
      const editorialCommunity = editorialCommunities.find((each) => each.id === review.editorialCommunityId);
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

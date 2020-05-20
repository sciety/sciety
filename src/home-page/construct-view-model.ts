import { Context, Middleware, Next } from 'koa';
import ReviewReference from '../types/review-reference';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { mostRecentReviewReferences, editorialCommunities } = ctx.state;
    const fetchedArticles = await ctx.state.fetchedArticles;

    ctx.state.viewModel = {
      mostRecentReviews: mostRecentReviewReferences.map((reviewReference: ReviewReference) => ({
        articleDoi: reviewReference.articleVersionDoi,
        articleTitle: fetchedArticles[reviewReference.articleVersionDoi.value].title,
        editorialCommunityName: editorialCommunities[reviewReference.editorialCommunityId].name,
        added: reviewReference.added,
      })),
    };

    await next();
  }
);

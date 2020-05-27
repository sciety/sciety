import arrayUniq from 'array-uniq';
import { Context, Middleware, Next } from 'koa';
import ReviewReferenceRepository from '../types/review-reference-repository';

export default (
  reviewReferenceRepository: ReviewReferenceRepository,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { editorialCommunity } = ctx.state;

    const reviewedArticleVersions = reviewReferenceRepository.findReviewsForEditorialCommunityId(editorialCommunity.id)
      .map((reviewReference) => reviewReference.articleVersionDoi);

    ctx.state.reviewedArticleVersionDois = arrayUniq(reviewedArticleVersions);

    await next();
  }
);

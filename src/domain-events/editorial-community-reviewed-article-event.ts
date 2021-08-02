import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type EditorialCommunityReviewedArticleEvent = Readonly<{
  type: 'EditorialCommunityReviewedArticle',
  date: Date,
  editorialCommunityId: GroupId,
  articleId: Doi,
  reviewId: ReviewId,
}>;

export const editorialCommunityReviewedArticle = (
  editorialCommunityId: GroupId,
  doi: Doi,
  reviewId: ReviewId,
  date: Date = new Date(),
): EditorialCommunityReviewedArticleEvent => ({
  type: 'EditorialCommunityReviewedArticle',
  date,
  editorialCommunityId,
  articleId: doi,
  reviewId,
});

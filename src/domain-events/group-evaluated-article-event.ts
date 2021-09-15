import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type GroupEvaluatedArticleEvent = Readonly<{
  type: 'GroupEvaluatedArticle',
  date: Date,
  groupId: GroupId,
  articleId: Doi,
  reviewId: ReviewId,
}>;

export const groupEvaluatedArticle = (
  groupId: GroupId,
  doi: Doi,
  reviewId: ReviewId,
  date: Date = new Date(),
): GroupEvaluatedArticleEvent => ({
  type: 'GroupEvaluatedArticle',
  date,
  groupId,
  articleId: doi,
  reviewId,
});

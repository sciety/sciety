import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type EvaluationRecordedEvent = Readonly<{
  type: 'GroupEvaluatedArticle',
  date: Date,
  groupId: GroupId,
  articleId: Doi,
  reviewId: ReviewId,
  authors: ReadonlyArray<string>,
}>;

export const groupEvaluatedArticle = (
  groupId: GroupId,
  doi: Doi,
  reviewId: ReviewId,
  date: Date = new Date(),
  authors: ReadonlyArray<string> = [],
): EvaluationRecordedEvent => ({
  type: 'GroupEvaluatedArticle',
  date,
  groupId,
  articleId: doi,
  reviewId,
  authors,
});

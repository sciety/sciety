import { Doi } from './doi';
import { GroupId } from './group-id';
import { ReviewId } from './review-id';

export type RecordedEvaluation = {
  articleId: Doi,
  reviewId: ReviewId,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};

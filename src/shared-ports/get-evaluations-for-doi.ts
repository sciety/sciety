import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

type RecordedEvaluation = {
  articleId: Doi,
  reviewId: ReviewId,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};

export type GetEvaluationsForDoi = (articleDoi: Doi) => ReadonlyArray<RecordedEvaluation>;

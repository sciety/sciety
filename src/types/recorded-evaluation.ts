import { Doi } from './doi';
import { GroupId } from './group-id';
import { EvaluationLocator } from './evaluation-locator';

export type RecordedEvaluation = {
  articleId: Doi,
  reviewId: EvaluationLocator,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};

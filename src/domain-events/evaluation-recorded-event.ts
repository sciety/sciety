import { Doi } from '../types/doi';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type EvaluationRecordedEvent = Readonly<{
  type: 'EvaluationRecorded',
  date: Date,
  groupId: GroupId,
  articleId: Doi,
  evaluationLocator: ReviewId,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
}>;

export const evaluationRecorded = (
  groupId: GroupId,
  doi: Doi,
  evaluationLocator: ReviewId,
  date: Date = new Date(),
  authors: ReadonlyArray<string> = [],
  publishedAt: Date = new Date(),
): EvaluationRecordedEvent => ({
  type: 'EvaluationRecorded',
  date,
  groupId,
  articleId: doi,
  evaluationLocator,
  publishedAt,
  authors,
});

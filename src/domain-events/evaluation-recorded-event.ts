import { Doi } from '../types/doi';
import { EventId, generate } from '../types/event-id';
import { GroupId } from '../types/group-id';
import { ReviewId } from '../types/review-id';

export type EvaluationRecordedEvent = Readonly<{
  id: EventId,
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
  authors: ReadonlyArray<string> = [],
  publishedAt: Date = new Date(),
  date: Date = new Date(),
): EvaluationRecordedEvent => ({
  id: generate(),
  type: 'EvaluationRecorded',
  date,
  groupId,
  articleId: doi,
  evaluationLocator,
  publishedAt,
  authors,
});

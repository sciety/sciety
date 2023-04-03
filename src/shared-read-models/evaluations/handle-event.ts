/* eslint-disable no-param-reassign */
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { Doi } from '../../types/doi';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

export type RecordedEvaluation = {
  articleId: Doi,
  reviewId: ReviewId,
  groupId: GroupId,
  recordedAt: Date,
  publishedAt: Date,
  authors: ReadonlyArray<string>,
};

export type ReadModel = Record<string, Array<RecordedEvaluation>>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    const key = event.articleId.value;
    const evaluations = readmodel[event.articleId.value] ?? [];
    evaluations.push({
      articleId: event.articleId,
      reviewId: event.evaluationLocator,
      groupId: event.groupId,
      recordedAt: event.date,
      publishedAt: event.publishedAt,
      authors: event.authors,
    });
    readmodel[key] = evaluations;
  }
  return readmodel;
};

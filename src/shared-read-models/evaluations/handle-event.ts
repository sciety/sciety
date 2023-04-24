/* eslint-disable no-param-reassign */
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

export type ReadModel = {
  byArticleId: Record<string, Array<RecordedEvaluation>>,
  byGroupId: Record<string, Array<RecordedEvaluation>>,
};

export const initialState = (): ReadModel => ({
  byArticleId: {},
  byGroupId: {},
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEvaluationRecordedEvent(event)) {
    const recordedEvaluation: RecordedEvaluation = {
      articleId: event.articleId,
      reviewId: event.evaluationLocator,
      groupId: event.groupId,
      recordedAt: event.date,
      publishedAt: event.publishedAt,
      authors: event.authors,
    };
    const evaluationsForThisArticle = readmodel.byArticleId[event.articleId.value] ?? [];
    const evaluationsByThisGroup = readmodel.byGroupId[event.groupId] ?? [];
    evaluationsForThisArticle.push(recordedEvaluation);
    evaluationsByThisGroup.push(recordedEvaluation);
    readmodel.byArticleId[event.articleId.value] = evaluationsForThisArticle;
    readmodel.byGroupId[event.groupId] = evaluationsByThisGroup;
  }
  return readmodel;
};

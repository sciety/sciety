/* eslint-disable no-param-reassign */
import { DomainEvent, isEvaluationRecordedEvent } from '../../domain-events';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

export type ReadModel = {
  byArticleId: Map<string, Array<RecordedEvaluation>>,
  byGroupId: Map<string, Array<RecordedEvaluation>>,
};

export const initialState = (): ReadModel => ({
  byArticleId: new Map(),
  byGroupId: new Map(),
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
    const evaluationsForThisArticle = readmodel.byArticleId.get(event.articleId.value) ?? [];
    const evaluationsByThisGroup = readmodel.byGroupId.get(event.groupId) ?? [];
    evaluationsForThisArticle.push(recordedEvaluation);
    evaluationsByThisGroup.push(recordedEvaluation);
    readmodel.byArticleId.set(event.articleId.value, evaluationsForThisArticle);
    readmodel.byGroupId.set(event.groupId, evaluationsByThisGroup);
  }
  return readmodel;
};

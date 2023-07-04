/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { DomainEvent, isEventOfType } from '../../domain-events';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

export type ReadModel = {
  byArticleId: Map<string, Array<RecordedEvaluation>>,
  byGroupId: Map<string, Map<string, RecordedEvaluation>>,
};

export const initialState = (): ReadModel => ({
  byArticleId: new Map(),
  byGroupId: new Map(),
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationRecorded')(event)) {
    const recordedEvaluation: RecordedEvaluation = {
      articleId: event.articleId,
      evaluationLocator: event.evaluationLocator,
      groupId: event.groupId,
      recordedAt: event.date,
      publishedAt: event.publishedAt,
      authors: event.authors,
      type: O.fromNullable(event.evaluationType),
    };
    const evaluationsForThisArticle = readmodel.byArticleId.get(event.articleId.value) ?? [];
    const evaluationsByThisGroup = readmodel.byGroupId.get(event.groupId) ?? new Map();
    evaluationsForThisArticle.push(recordedEvaluation);
    evaluationsByThisGroup.set(event.evaluationLocator, recordedEvaluation);
    readmodel.byArticleId.set(event.articleId.value, evaluationsForThisArticle);
    readmodel.byGroupId.set(event.groupId, evaluationsByThisGroup);
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    readmodel.byArticleId.forEach((state) => {
      const i = state.findIndex((evaluation) => evaluation.evaluationLocator === event.evaluationLocator);
      if (i > -1) {
        state.splice(i, 1);
      }
    });
    readmodel.byGroupId.forEach((state) => {
      state.delete(event.evaluationLocator);
    });
  }
  if (isEventOfType('CurationStatementRecorded')(event)) {
    readmodel.byGroupId.forEach((state) => {
      const evaluation = state.get(event.evaluationLocator);
      if (evaluation) {
        evaluation.type = O.some('curation-statement');
      }
    });
  }
  return readmodel;
};

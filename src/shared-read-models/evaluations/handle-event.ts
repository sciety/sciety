/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type RecordedEvaluationsForArticle = Array<RecordedEvaluation>;

export type ReadModel = {
  byArticleId: Map<string, RecordedEvaluationsForArticle>,
  byGroupId: Map<string, Map<string, RecordedEvaluation>>,
};

export const initialState = (): ReadModel => ({
  byArticleId: new Map(),
  byGroupId: new Map(),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hasAlreadyBeenRecorded = (event: EventOfType<'EvaluationRecorded'>, existingEvaluations: RecordedEvaluationsForArticle) => false;

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationRecorded')(event)) {
    const evaluationsForThisArticle = readmodel.byArticleId.get(event.articleId.value) ?? [];
    if (!hasAlreadyBeenRecorded(event, evaluationsForThisArticle)) {
      const recordedEvaluation: RecordedEvaluation = {
        articleId: event.articleId,
        evaluationLocator: event.evaluationLocator,
        groupId: event.groupId,
        recordedAt: event.date,
        publishedAt: event.publishedAt,
        authors: event.authors,
        type: O.fromNullable(event.evaluationType),
      };
      const evaluationsByThisGroup = readmodel.byGroupId.get(event.groupId) ?? new Map();
      evaluationsForThisArticle.push(recordedEvaluation);
      evaluationsByThisGroup.set(event.evaluationLocator, recordedEvaluation);
      readmodel.byArticleId.set(event.articleId.value, evaluationsForThisArticle);
      readmodel.byGroupId.set(event.groupId, evaluationsByThisGroup);
    }
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
  if (isEventOfType('EvaluationUpdated')(event)) {
    readmodel.byGroupId.forEach((state) => {
      const evaluation = state.get(event.evaluationLocator);
      if (evaluation) {
        if (event.evaluationType) {
          evaluation.type = O.some(event.evaluationType);
        }
      }
    });
  }
  return readmodel;
};

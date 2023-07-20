/* eslint-disable no-param-reassign */
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
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

const hasAlreadyBeenRecorded = (event: EventOfType<'EvaluationRecorded'>, existingEvaluations: RecordedEvaluationsForArticle) => pipe(
  existingEvaluations,
  RA.some((existingEvaluation) => existingEvaluation.evaluationLocator === event.evaluationLocator),
);

const addToIndexByArticle = (recordedEvaluation: RecordedEvaluation, readmodel: ReadModel) => {
  const evaluationsForThisArticle = readmodel.byArticleId.get(recordedEvaluation.articleId.value) ?? [];
  evaluationsForThisArticle.push(recordedEvaluation);
  readmodel.byArticleId.set(recordedEvaluation.articleId.value, evaluationsForThisArticle);
};

const removeFromIndexByArticle = (event: EventOfType<'IncorrectlyRecordedEvaluationErased'>, readmodel: ReadModel) => {
  readmodel.byArticleId.forEach((state) => {
    const i = state.findIndex((evaluation) => evaluation.evaluationLocator === event.evaluationLocator);
    if (i > -1) {
      state.splice(i, 1);
    }
  });
};

const addToIndexByGroup = (recordedEvaluation: RecordedEvaluation, readmodel: ReadModel) => {
  const evaluationsByThisGroup = readmodel.byGroupId.get(recordedEvaluation.groupId) ?? new Map();
  evaluationsByThisGroup.set(recordedEvaluation.evaluationLocator, recordedEvaluation);
  readmodel.byGroupId.set(recordedEvaluation.groupId, evaluationsByThisGroup);
};

const removeFromIndexByGroup = (event: EventOfType<'IncorrectlyRecordedEvaluationErased'>, readmodel: ReadModel) => {
  readmodel.byGroupId.forEach((state) => {
    state.delete(event.evaluationLocator);
  });
};

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
      addToIndexByArticle(recordedEvaluation, readmodel);
      addToIndexByGroup(recordedEvaluation, readmodel);
    }
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    removeFromIndexByArticle(event, readmodel);
    removeFromIndexByGroup(event, readmodel);
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

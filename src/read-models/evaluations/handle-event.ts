/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEventOfType } from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import { RecordedEvaluation } from '../../types/recorded-evaluation';

type RecordedEvaluationsForExpression = Array<RecordedEvaluation>;

export type ReadModel = {
  byEvaluationLocator: Map<EvaluationLocator, RecordedEvaluation>,
  byExpressionDoi: Map<ExpressionDoi, RecordedEvaluationsForExpression>,
  byGroupId: Map<string, Map<string, RecordedEvaluation>>,
};

export const initialState = (): ReadModel => ({
  byEvaluationLocator: new Map(),
  byExpressionDoi: new Map(),
  byGroupId: new Map(),
});

const hasAlreadyBeenRecorded = (
  evaluationLocator: EvaluationLocator,
  existingEvaluations: RecordedEvaluationsForExpression,
) => pipe(
  existingEvaluations,
  RA.some((existingEvaluation) => existingEvaluation.evaluationLocator === evaluationLocator),
);

const addToIndexByExpressionDoi = (recordedEvaluation: RecordedEvaluation, readmodel: ReadModel) => {
  const evaluationsForThisExpression = readmodel.byExpressionDoi.get(recordedEvaluation.expressionDoi) ?? [];
  evaluationsForThisExpression.push(recordedEvaluation);
  readmodel.byExpressionDoi.set(recordedEvaluation.expressionDoi, evaluationsForThisExpression);
};

const removeFromIndexByExpressionDoi = (evaluationLocator: EvaluationLocator, readmodel: ReadModel) => {
  readmodel.byExpressionDoi.forEach((state) => {
    const i = state.findIndex((evaluation) => evaluation.evaluationLocator === evaluationLocator);
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

const removeFromIndexByGroup = (evaluationLocator: EvaluationLocator, readmodel: ReadModel) => {
  readmodel.byGroupId.forEach((state) => {
    state.delete(evaluationLocator);
  });
};

const addToIndexByEvaluationLocator = (recordedEvaluation: RecordedEvaluation, readmodel: ReadModel) => {
  readmodel.byEvaluationLocator.set(recordedEvaluation.evaluationLocator, recordedEvaluation);
};

const removeFromIndexByEvaluationLocator = (evaluationLocator: EvaluationLocator, readmodel: ReadModel) => {
  readmodel.byEvaluationLocator.delete(evaluationLocator);
};

const removeFromAllIndexes = (evaluationLocator: EvaluationLocator, readmodel: ReadModel) => {
  removeFromIndexByEvaluationLocator(evaluationLocator, readmodel);
  removeFromIndexByExpressionDoi(evaluationLocator, readmodel);
  removeFromIndexByGroup(evaluationLocator, readmodel);
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    const evaluationsForThisExpression = readmodel.byExpressionDoi.get(event.articleId) ?? [];
    if (!hasAlreadyBeenRecorded(event.evaluationLocator, evaluationsForThisExpression)) {
      const recordedEvaluation: RecordedEvaluation = {
        expressionDoi: event.articleId,
        evaluationLocator: event.evaluationLocator,
        groupId: event.groupId,
        recordedAt: event.date,
        publishedAt: event.publishedAt,
        updatedAt: event.date,
        authors: event.authors,
        type: O.fromNullable(event.evaluationType),
      };
      addToIndexByEvaluationLocator(recordedEvaluation, readmodel);
      addToIndexByExpressionDoi(recordedEvaluation, readmodel);
      addToIndexByGroup(recordedEvaluation, readmodel);
    }
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    removeFromAllIndexes(event.evaluationLocator, readmodel);
  }
  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    removeFromAllIndexes(event.evaluationLocator, readmodel);
  }
  if (isEventOfType('EvaluationUpdated')(event)) {
    const evaluation = readmodel.byEvaluationLocator.get(event.evaluationLocator);
    if (evaluation === undefined) {
      return readmodel;
    }
    evaluation.updatedAt = event.date;
    if (event.evaluationType !== undefined) {
      evaluation.type = O.some(event.evaluationType);
    }
    if (event.authors !== undefined) {
      evaluation.authors = event.authors;
    }
  }
  return readmodel;
};

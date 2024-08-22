/* eslint-disable @typescript-eslint/no-unused-vars */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type PendingEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

type ReadModel = Array<PendingEvaluation>;

export const initialState = (): ReadModel => [];

export const handleEvent = (
  consideredGroupIds: ReadonlyArray<GroupId>,
) => (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    if (consideredGroupIds.includes(event.groupId)) {
      readModel.push({
        expressionDoi: event.articleId,
        evaluationLocator: event.evaluationLocator,
      });
    }
  }
  return readModel;
};

export const getPendingEvaluations = (readModel: ReadModel) => (): ReadonlyArray<PendingEvaluation> => readModel;

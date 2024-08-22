import { DomainEvent, isEventOfType } from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type PendingEvaluation = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
};

export type ReadModel = Array<PendingEvaluation>;

export const initialState = (): ReadModel => [];

const removePendingEvaluation = (readModel: ReadModel, evaluationLocator: EvaluationLocator) => {
  const index = readModel.findIndex((pendingEvaluation) => pendingEvaluation.evaluationLocator === evaluationLocator);
  if (index > -1) {
    readModel.splice(index, 1);
  }
};

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
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    const evaluationLocator = event.evaluationLocator;
    removePendingEvaluation(readModel, evaluationLocator);
  }
  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    const evaluationLocator = event.evaluationLocator;
    removePendingEvaluation(readModel, evaluationLocator);
  }
  return readModel;
};

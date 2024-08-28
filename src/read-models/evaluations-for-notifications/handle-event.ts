import { URL } from 'url';
import { DomainEvent, isEventOfType } from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type Target = {
  id: URL,
  inbox: URL,
};

export type PendingNotification = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
  target: Target,
};

export type ReadModel = Array<PendingNotification>;

export const initialState = (): ReadModel => [];

const removeFirstPendingNotificationMatchingEvaluation = (
  readModel: ReadModel,
  evaluationLocator: EvaluationLocator,
) => {
  const index = readModel.findIndex(
    (pendingNotification) => pendingNotification.evaluationLocator === evaluationLocator,
  );
  if (index > -1) {
    readModel.splice(index, 1);
  }
};

const removePendingNotificationMatchingEvaluationAndTarget = (
  readModel: ReadModel,
  evaluationLocator: EvaluationLocator,
  targetId: Target['id'],
) => {
  const index = readModel.findIndex(
    (pendingNotification) => pendingNotification.evaluationLocator === evaluationLocator
    && pendingNotification.target.id.href === targetId.href,
  );
  if (index > -1) {
    readModel.splice(index, 1);
  }
};

export const handleEvent = (
  consideredGroups: ReadonlyMap<GroupId, ReadonlyArray<Target>>,
) => (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    const targets = consideredGroups.get(event.groupId);
    if (targets !== undefined) {
      targets.forEach((target) => {
        readModel.push({
          expressionDoi: event.articleId,
          evaluationLocator: event.evaluationLocator,
          target,
        });
      });
    }
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    const evaluationLocator = event.evaluationLocator;
    removeFirstPendingNotificationMatchingEvaluation(readModel, evaluationLocator);
  }
  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    const evaluationLocator = event.evaluationLocator;
    removeFirstPendingNotificationMatchingEvaluation(readModel, evaluationLocator);
  }
  if (isEventOfType('CoarNotificationDelivered')(event)) {
    const evaluationLocator = event.evaluationLocator;
    removePendingNotificationMatchingEvaluationAndTarget(readModel, evaluationLocator, new URL(event.targetId));
  }
  return readModel;
};

import { URL } from 'url';
import { DomainEvent, isEventOfType } from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ExpressionDoi } from '../../types/expression-doi';
import { GroupId } from '../../types/group-id';

export type Target = {
  id: string,
  inbox: URL,
};

export type PendingNotification = {
  expressionDoi: ExpressionDoi,
  evaluationLocator: EvaluationLocator,
  target: Target,
};

export type ReadModel = Map<EvaluationLocator, Array<PendingNotification>>;

export const initialState = (): ReadModel => new Map();

const removeFirstPendingNotificationMatchingEvaluation = (
  readModel: ReadModel,
  evaluationLocator: EvaluationLocator,
) => {
  readModel.delete(evaluationLocator);
};

const removePendingNotificationMatchingEvaluationAndTarget = (
  readModel: ReadModel,
  evaluationLocator: EvaluationLocator,
  targetId: Target['id'],
) => {
  const notifications = readModel.get(evaluationLocator);
  if (notifications !== undefined) {
    const index = notifications.findIndex(
      (pendingNotification) => pendingNotification.target.id === targetId,
    );
    if (index > -1) {
      notifications.splice(index, 1);
    }
  }
};

export const handleEvent = (
  consideredGroups: ReadonlyMap<GroupId, ReadonlyArray<Target>>,
) => (readModel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    const targets = consideredGroups.get(event.groupId);
    if (targets !== undefined) {
      const notifications: Array<PendingNotification> = [];
      targets.forEach((target) => {
        notifications.push({
          expressionDoi: event.articleId,
          evaluationLocator: event.evaluationLocator,
          target,
        });
      });
      readModel.set(event.evaluationLocator, notifications);
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
    removePendingNotificationMatchingEvaluationAndTarget(readModel, evaluationLocator, event.targetId);
  }
  return readModel;
};

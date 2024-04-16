/* eslint-disable no-param-reassign */
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { GroupId } from '../../types/group-id';

type EvaluationThumbnail = {
  evaluationLocator: EvaluationLocator,
  publishedAt: Date,
};

export type Activity = Map<EvaluationLocator, EvaluationThumbnail>;

export type ReadModel = Map<GroupId, Activity>;

export const initialState = (): ReadModel => (new Map());

const groupJoined = (readmodel: ReadModel, event: EventOfType<'GroupJoined'>) => {
  readmodel.set(event.groupId, new Map());
};

const evaluationRecorded = (readmodel: ReadModel, event: EventOfType<'EvaluationPublicationRecorded'>) => {
  const groupActivity = readmodel.get(event.groupId);
  if (groupActivity === undefined) {
    return;
  }
  if (!groupActivity.has(event.evaluationLocator)) {
    groupActivity.set(event.evaluationLocator, {
      evaluationLocator: event.evaluationLocator,
      publishedAt: event.publishedAt,
    });
  }
};

const excludeEvaluation = (readmodel: ReadModel, evaluationLocator: EvaluationLocator) => {
  readmodel.forEach((groupActivity) => {
    if (groupActivity.has(evaluationLocator)) {
      groupActivity.delete(evaluationLocator);
    }
  });
};

const evaluationErased = (readmodel: ReadModel, event: EventOfType<'IncorrectlyRecordedEvaluationErased'>) => {
  excludeEvaluation(readmodel, event.evaluationLocator);
};

const evaluationRemoved = (readmodel: ReadModel, event: EventOfType<'EvaluationRemovalRecorded'>) => {
  excludeEvaluation(readmodel, event.evaluationLocator);
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('GroupJoined')(event)) {
    groupJoined(readmodel, event);
  }
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    evaluationRecorded(readmodel, event);
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    evaluationErased(readmodel, event);
  }
  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    evaluationRemoved(readmodel, event);
  }
  return readmodel;
};

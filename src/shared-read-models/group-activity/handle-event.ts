/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { DomainEvent, EventOfType, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { EvaluationLocator } from '../../types/evaluation-locator';

type EvaluationState = {
  evaluationLocator: EvaluationLocator,
  publishedAt: Date,
};

export type Activity = {
  evaluationStates: Map<EvaluationLocator, EvaluationState>,
  latestActivityAt: O.Option<Date>,
};

export type ReadModel = Map<GroupId, Activity>;

export const initialState = (): ReadModel => (new Map());

const groupJoined = (readmodel: ReadModel, event: EventOfType<'GroupJoined'>) => {
  readmodel.set(event.groupId, {
    latestActivityAt: O.none,
    evaluationStates: new Map(),
  });
};

const evaluationRecorded = (readmodel: ReadModel, event: EventOfType<'EvaluationRecorded'>) => {
  const groupActivity = readmodel.get(event.groupId);
  if (groupActivity === undefined) {
    return;
  }
  if (!groupActivity.evaluationStates.has(event.evaluationLocator)) {
    groupActivity.evaluationStates.set(event.evaluationLocator, {
      evaluationLocator: event.evaluationLocator,
      publishedAt: event.publishedAt,
    });
  }
};

const evaluationErased = (readmodel: ReadModel, event: EventOfType<'IncorrectlyRecordedEvaluationErased'>) => {
  readmodel.forEach((state) => {
    if (state.evaluationStates.has(event.evaluationLocator)) {
      state.evaluationStates.delete(event.evaluationLocator);
    }
  });
};

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('GroupJoined')(event)) {
    groupJoined(readmodel, event);
  }
  if (isEventOfType('EvaluationRecorded')(event)) {
    evaluationRecorded(readmodel, event);
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    evaluationErased(readmodel, event);
  }
  return readmodel;
};

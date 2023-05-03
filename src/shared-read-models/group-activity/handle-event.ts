/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import {
  DomainEvent, isEvaluationRecordedEvent, isGroupJoinedEvent, isIncorrectlyRecordedEvaluationErasedEvent,
} from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

type EvaluationState = {
  evaluationLocator: ReviewId,
  publishedAt: Date,
};

export type ReadModel = Map<GroupId, { evaluationStates: Array<EvaluationState>, latestActivityAt: O.Option<Date> }>;

export const initialState = (): ReadModel => (new Map());

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel.set(event.groupId, {
      latestActivityAt: O.none,
      evaluationStates: [],
    });
  }
  if (isEvaluationRecordedEvent(event)) {
    const state = readmodel.get(event.groupId);

    if (state === undefined) {
      return readmodel;
    }
    state.evaluationStates.push({ evaluationLocator: event.evaluationLocator, publishedAt: event.publishedAt });
  }
  if (isIncorrectlyRecordedEvaluationErasedEvent(event)) {
    readmodel.forEach((state) => {
      const i = state.evaluationStates.findIndex(
        (evaluationState) => evaluationState.evaluationLocator === event.evaluationLocator,
      );
      if (i > -1) {
        state.evaluationStates.splice(i, 1);
      }
    });
  }
  return readmodel;
};

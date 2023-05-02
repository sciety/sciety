/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, isEvaluationRecordedEvent, isGroupJoinedEvent, isIncorrectlyRecordedEvaluationErasedEvent,
} from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

export type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

export type ReadModel = Map<GroupId, { evaluationLocators: Array<ReviewId>, latestActivityAt: O.Option<Date> }>;

export const initialState = (): ReadModel => (new Map());

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel.set(event.groupId, {
      latestActivityAt: O.none,
      evaluationLocators: [],
    });
  }
  if (isEvaluationRecordedEvent(event)) {
    const state = readmodel.get(event.groupId);

    if (state === undefined) {
      return readmodel;
    }
    state.evaluationLocators.push(event.evaluationLocator);
    const newPublishedAt = pipe(
      state.latestActivityAt,
      O.map((previousPublishedAt) => (
        event.publishedAt > previousPublishedAt
          ? event.publishedAt
          : previousPublishedAt
      )),
      O.alt(() => O.some(event.publishedAt)),
    );
    state.latestActivityAt = newPublishedAt;
  }
  if (isIncorrectlyRecordedEvaluationErasedEvent(event)) {
    readmodel.forEach((state) => {
      const i = state.evaluationLocators.indexOf(event.evaluationLocator);
      if (i > -1) {
        state.evaluationLocators.splice(i, 1);
      }
    });
  }
  return readmodel;
};

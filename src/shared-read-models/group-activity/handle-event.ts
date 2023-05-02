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

export type ReadModel = Record<GroupId, { evaluationLocators: Array<ReviewId>, latestActivityAt: O.Option<Date> }>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel[event.groupId] = {
      latestActivityAt: O.none,
      evaluationLocators: [],
    };
  }
  if (isEvaluationRecordedEvent(event)) {
    if (readmodel[event.groupId] === undefined) {
      return readmodel;
    }
    readmodel[event.groupId].evaluationLocators.push(event.evaluationLocator);
    const newPublishedAt = pipe(
      readmodel[event.groupId].latestActivityAt,
      O.map((previousPublishedAt) => (
        event.publishedAt > previousPublishedAt
          ? event.publishedAt
          : previousPublishedAt
      )),
      O.alt(() => O.some(event.publishedAt)),
    );
    readmodel[event.groupId].latestActivityAt = newPublishedAt;
  }
  if (isIncorrectlyRecordedEvaluationErasedEvent(event)) {
    const groupIds = Object.keys(readmodel) as unknown as ReadonlyArray<GroupId>;
    groupIds.forEach((groupId) => {
      const i = readmodel[groupId].evaluationLocators.indexOf(event.evaluationLocator);
      if (i > -1) {
        readmodel[groupId].evaluationLocators.splice(i, 1);
      }
    });
  }
  return readmodel;
};

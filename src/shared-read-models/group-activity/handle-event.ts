/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEvaluationRecordedEvent, isGroupJoinedEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { ReviewId } from '../../types/review-id';

export type GroupActivity = {
  evaluationCount: number,
  latestActivityAt: O.Option<Date>,
};

export type ReadModel = Record<GroupId, GroupActivity & { evaluationLocators: Array<ReviewId> }>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel[event.groupId] = {
      evaluationCount: 0,
      latestActivityAt: O.none,
      evaluationLocators: [],
    };
  }
  if (isEvaluationRecordedEvent(event)) {
    if (readmodel[event.groupId] === undefined) {
      return readmodel;
    }
    readmodel[event.groupId].evaluationLocators.push(event.evaluationLocator);
    readmodel[event.groupId].evaluationCount += 1;
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
  return readmodel;
};

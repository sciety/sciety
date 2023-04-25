/* eslint-disable no-param-reassign */
import * as O from 'fp-ts/Option';
import { DomainEvent, isEvaluationRecordedEvent, isGroupJoinedEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

export type GroupActivity = { evaluationCount: number, latestActivityAt: O.Option<Date> };

export type ReadModel = Record<GroupId, GroupActivity>;

// ts-unused-exports:disable-next-line
export const initialState = (): ReadModel => ({});

// ts-unused-exports:disable-next-line
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel[event.groupId] = { evaluationCount: 0, latestActivityAt: O.none };
  }
  if (isEvaluationRecordedEvent(event)) {
    readmodel[event.groupId].evaluationCount += 1;
    readmodel[event.groupId].latestActivityAt = O.some(event.publishedAt);
  }
  return readmodel;
};

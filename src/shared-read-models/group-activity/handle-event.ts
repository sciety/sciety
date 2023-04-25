/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import { DomainEvent, isGroupJoinedEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';

export type ReadModel = Record<GroupId, { evaluationCount: number }>;

// ts-unused-exports:disable-next-line
export const initialState = (): ReadModel => ({});

// ts-unused-exports:disable-next-line
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isGroupJoinedEvent(event)) {
    readmodel[event.groupId] = { evaluationCount: 0 };
  }
  return readmodel;
};

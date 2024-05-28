/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, Array<GroupId>>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserAssignedAsAdminOfGroup')(event)) {
    const current = readmodel[event.userId] ?? [];
    current.push(event.groupId);
    readmodel[event.userId] = current;
  }
  return readmodel;
};

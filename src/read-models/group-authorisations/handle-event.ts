/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = {
  byUserId: Record<UserId, Array<GroupId>>,
};

export const initialState = (): ReadModel => ({
  byUserId: {},
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserAssignedAsAdminOfGroup')(event)) {
    const current = readmodel.byUserId[event.userId] ?? [];
    current.push(event.groupId);
    readmodel.byUserId[event.userId] = current;
  }
  return readmodel;
};

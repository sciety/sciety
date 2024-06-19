/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = {
  byUserId: Map<UserId, Array<GroupId>>,
};

export const initialState = (): ReadModel => ({
  byUserId: new Map(),
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserAssignedAsAdminOfGroup')(event)) {
    const current = readmodel.byUserId.get(event.userId) ?? [];
    current.push(event.groupId);
    readmodel.byUserId.set(event.userId, current);
  }
  return readmodel;
};

/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = {
  byUserId: Map<UserId, Array<GroupId>>,
  byGroupId: Map<GroupId, Array<UserId>>,
};

export const initialState = (): ReadModel => ({
  byUserId: new Map(),
  byGroupId: new Map(),
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserAssignedAsAdminOfGroup')(event)) {
    const groupsThatAreAdministeredByThisUser = readmodel.byUserId.get(event.userId) ?? [];
    groupsThatAreAdministeredByThisUser.push(event.groupId);
    readmodel.byUserId.set(event.userId, groupsThatAreAdministeredByThisUser);

    const userIdsThatAreAdminsOfTheGroup = readmodel.byGroupId.get(event.groupId) ?? [];
    userIdsThatAreAdminsOfTheGroup.push(event.userId);
    readmodel.byGroupId.set(event.groupId, userIdsThatAreAdminsOfTheGroup);
  }
  return readmodel;
};

/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, Array<GroupId>>;

export const initialState = (): ReadModel => ({
  ['auth0|650a91161c07d3acf5ff7da5' as UserId]: ['d6e1a913-76f8-40dc-9074-8eac033e1bc8' as GroupId],
  ['twitter|1384541806231175172' as UserId]: ['4bbf0c12-629b-4bb8-91d6-974f4df8efb2' as GroupId],
  ['auth0|65faae8fd0f034a2c4c72b7c' as UserId]: ['10360d97-bf52-4aef-b2fa-2f60d319edd7' as GroupId],
  ['twitter|1443469693621309444' as UserId]: ['b5f31635-d32b-4df9-92a5-0325a1524343' as GroupId],
  ['twitter|380816062' as UserId]: ['b560187e-f2fb-4ff9-a861-a204f3fc0fb0' as GroupId],
});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserAssignedAsAdminOfGroup')(event)) {
    const current = readmodel[event.userId] ?? [];
    current.push(event.groupId);
    readmodel[event.userId] = current;
  }
  return readmodel;
};

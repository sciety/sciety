/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type ReadModel = Record<UserId, Array<GroupId>>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('UserFollowedEditorialCommunity')(event)) {
    const current = readmodel[event.userId] ?? [];
    current.push(event.editorialCommunityId);
    readmodel[event.userId] = current;
  } else if (isEventOfType('UserUnfollowedEditorialCommunity')(event)) {
    const current = readmodel[event.userId] ?? [];
    const ix = current.indexOf(event.editorialCommunityId);
    if (ix >= 0) {
      current.splice(ix, 1);
      readmodel[event.userId] = current;
    }
  }
  return readmodel;
};

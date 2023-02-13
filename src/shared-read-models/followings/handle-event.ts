/* eslint-disable no-param-reassign */
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../../domain-events';

export type ReadModel = Record<UserId, Array<GroupId>>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isUserFollowedEditorialCommunityEvent(event)) {
    const current = readmodel[event.userId] ?? [];
    current.push(event.editorialCommunityId);
    readmodel[event.userId] = current;
  } else if (isUserUnfollowedEditorialCommunityEvent(event)) {
    const current = readmodel[event.userId] ?? [];
    const ix = current.indexOf(event.editorialCommunityId);
    if (ix >= 0) {
      current.splice(ix, 1);
      readmodel[event.userId] = current;
    }
  }
  return readmodel;
};

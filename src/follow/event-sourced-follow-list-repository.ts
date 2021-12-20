import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../domain-events';
import * as Gid from '../types/group-id';
import { UserId } from '../types/user-id';

type GetFollowList = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Gid.GroupId>;

export const createEventSourceFollowListRepository: GetFollowList = (userId) => (events) => {
  const result = new Set<string>();
  events.forEach((event) => {
    if (isUserFollowedEditorialCommunityEvent(event) && event.userId === userId) {
      result.add(event.editorialCommunityId);
    } else if (isUserUnfollowedEditorialCommunityEvent(event) && event.userId === userId) {
      result.delete(event.editorialCommunityId);
    }
  });
  const list = Array.from(result);
  return list.map((id) => Gid.fromValidatedString(id));
};

export const isFollowing = (groupId: Gid.GroupId) => (groupIds: ReadonlyArray<Gid.GroupId>): boolean => (
  groupIds.includes(groupId)
);

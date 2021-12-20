import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

type IsFollowing = (userId: UserId, groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const isFollowing: IsFollowing = (userId, groupId) => (events) => {
  const result = new Set<string>();
  events.forEach((event) => {
    if (isUserFollowedEditorialCommunityEvent(event) && event.userId === userId) {
      result.add(event.editorialCommunityId);
    } else if (isUserUnfollowedEditorialCommunityEvent(event) && event.userId === userId) {
      result.delete(event.editorialCommunityId);
    }
  });
  const list = Array.from(result);
  return list.includes(groupId);
};

import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../domain-events';
import { FollowList } from './follow-list';
import { UserId } from '../types/user-id';

type GetFollowList = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => FollowList;

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
  return new FollowList(userId, list);
};

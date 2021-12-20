import * as T from 'fp-ts/Task';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../domain-events';
import { FollowList } from '../types/follow-list';
import { UserId } from '../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type EventSourcedFollowListRepository = (userId: UserId) => T.Task<FollowList>;

export const createEventSourceFollowListRepository = (getAllEvents: GetAllEvents): EventSourcedFollowListRepository => (
  (userId) => async () => {
    const result = new Set<string>();

    (await getAllEvents()).forEach((event) => {
      if (isUserFollowedEditorialCommunityEvent(event) && event.userId === userId) {
        result.add(event.editorialCommunityId);
      } else if (isUserUnfollowedEditorialCommunityEvent(event) && event.userId === userId) {
        result.delete(event.editorialCommunityId);
      }
    });

    const list = Array.from(result);

    return new FollowList(userId, list);
  }
);

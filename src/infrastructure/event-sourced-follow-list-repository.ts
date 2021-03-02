import * as T from 'fp-ts/Task';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import { FollowList } from '../types/follow-list';
import { UserId } from '../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type EventSourcedFollowListRepository = (userId: UserId) => Promise<FollowList>;

export const createEventSourceFollowListRepository = (getAllEvents: GetAllEvents): EventSourcedFollowListRepository => (
  async (userId) => {
    const result = new Set<string>();

    (await getAllEvents()).forEach((event) => {
      if (isUserFollowedEditorialCommunityEvent(event) && event.userId === userId) {
        result.add(event.editorialCommunityId.value);
      } else if (isUserUnfollowedEditorialCommunityEvent(event) && event.userId === userId) {
        result.delete(event.editorialCommunityId.value);
      }
    });

    const list = Array.from(result);

    return new FollowList(userId, list);
  }
);

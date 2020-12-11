import * as T from 'fp-ts/lib/Task';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
  UserFollowedEditorialCommunityEvent,
  UserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type ProjectFollowerIds = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<UserId>>;

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isInterestingEvent = (event: DomainEvent) : event is (
UserFollowedEditorialCommunityEvent |
UserUnfollowedEditorialCommunityEvent) => isUserFollowedEditorialCommunityEvent(event)
  || isUserUnfollowedEditorialCommunityEvent(event);

export default (getAllEvents: GetAllEvents): ProjectFollowerIds => (
  async (editorialCommunityId) => (
    (await getAllEvents())
      .filter(isInterestingEvent)
      .filter((event) => event.editorialCommunityId.value === editorialCommunityId.value)
      .reduce<Array<UserId>>(
      (userIds, event) => {
        if (isUserFollowedEditorialCommunityEvent(event)) {
          return userIds.concat([event.userId]);
        }
        return userIds.filter((userId) => userId !== event.userId);
      },
      [],
    )
  )
);

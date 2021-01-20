import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
  UserFollowedEditorialCommunityEvent,
  UserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type ProjectFollowerIds = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<UserId>>;

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isInterestingEvent = (event: DomainEvent) : event is (
UserFollowedEditorialCommunityEvent |
UserUnfollowedEditorialCommunityEvent) => isUserFollowedEditorialCommunityEvent(event)
  || isUserUnfollowedEditorialCommunityEvent(event);

const projectFollowerIds = (editorialCommunityId: EditorialCommunityId) => (
  events: ReadonlyArray<DomainEvent>,
): ReadonlyArray<UserId> => (
  events.filter(isInterestingEvent)
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
);

export default (getAllEvents: GetAllEvents): ProjectFollowerIds => (
  (editorialCommunityId) => pipe(
    getAllEvents,
    T.map(projectFollowerIds(editorialCommunityId)),
  )
);

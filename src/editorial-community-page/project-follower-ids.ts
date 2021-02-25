import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
  UserFollowedEditorialCommunityEvent,
  UserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { EditorialCommunityId, eqEditorialCommunityId } from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type ProjectFollowerIds = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<UserId>>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isInterestingEvent = (event: DomainEvent) : event is (
UserFollowedEditorialCommunityEvent |
UserUnfollowedEditorialCommunityEvent) => isUserFollowedEditorialCommunityEvent(event)
  || isUserUnfollowedEditorialCommunityEvent(event);

const projection = (editorialCommunityId: EditorialCommunityId) => (
  events: ReadonlyArray<DomainEvent>,
) => (
  events.filter(isInterestingEvent)
    .filter((event) => eqEditorialCommunityId.equals(event.editorialCommunityId, editorialCommunityId))
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

export const projectFollowerIds = (getAllEvents: GetAllEvents): ProjectFollowerIds => (
  (editorialCommunityId) => pipe(
    getAllEvents,
    T.map(projection(editorialCommunityId)),
  )
);

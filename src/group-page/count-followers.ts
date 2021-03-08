import { flow } from 'fp-ts/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
  UserFollowedEditorialCommunityEvent,
  UserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

const isInterestingEvent = (event: DomainEvent) : event is (
UserFollowedEditorialCommunityEvent |
UserUnfollowedEditorialCommunityEvent) => isUserFollowedEditorialCommunityEvent(event)
  || isUserUnfollowedEditorialCommunityEvent(event);

const projection = (groupId: GroupId) => (
  events: ReadonlyArray<DomainEvent>,
) => (
  events.filter(isInterestingEvent)
    .filter((event) => eqGroupId.equals(event.editorialCommunityId, groupId))
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

type CountFollowersOf = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => number;

export const countFollowersOf: CountFollowersOf = (groupId) => flow(
  projection(groupId),
  (fs) => fs.length,
);

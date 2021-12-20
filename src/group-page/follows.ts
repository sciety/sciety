import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

const isSignificantTo = (
  userId: UserId,
  groupId: GroupId,
) => (event: DomainEvent) => (
  (isUserFollowedEditorialCommunityEvent(event)
    && event.editorialCommunityId === groupId
    && event.userId === userId)
  || (isUserUnfollowedEditorialCommunityEvent(event)
    && event.editorialCommunityId === groupId
    && event.userId === userId)
);

type Follows = (u: UserId, g: GroupId) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const follows: Follows = (userId, groupId) => (events) => pipe(
  events,
  A.findLast(isSignificantTo(userId, groupId)),
  O.filter(isUserFollowedEditorialCommunityEvent),
  O.isSome,
);

import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isEventOfType } from '../../domain-events/index.js';
import { GroupId } from '../../types/group-id.js';
import { UserId } from '../../types/user-id.js';

const isSignificantTo = (userId: UserId, groupId: GroupId) => (event: DomainEvent) => (
  (isEventOfType('UserFollowedEditorialCommunity')(event)
    && event.editorialCommunityId === groupId
    && event.userId === userId)
  || (isEventOfType('UserUnfollowedEditorialCommunity')(event)
    && event.editorialCommunityId === groupId
    && event.userId === userId)
);

type IsFollowing = (userId: UserId, groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const isFollowing: IsFollowing = (userId, groupId) => (events) => pipe(
  events,
  RA.findLast(isSignificantTo(userId, groupId)),
  O.filter(isEventOfType('UserFollowedEditorialCommunity')),
  O.isSome,
);

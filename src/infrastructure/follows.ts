import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

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

export const follows = (getAllEvents: GetAllEvents): Follows => (userId, groupId) => pipe(
  getAllEvents,
  T.map(flow(
    A.findLast(isSignificantTo(userId, groupId)),
    O.filter(isUserFollowedEditorialCommunityEvent),
    O.isSome,
  )),
);

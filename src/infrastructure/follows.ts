import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as Refinement from 'fp-ts/Refinement';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';
import { GuardedType, refineAndPredicate } from '../utilities';

export type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const involves = (
  userId: UserId,
  groupId: GroupId,
) => (
  event: GuardedType<typeof isFollowsAggregateEvent>,
) => event.editorialCommunityId === groupId && event.userId === userId;

const isFollowsAggregateEvent = pipe(
  isUserFollowedEditorialCommunityEvent,
  Refinement.or(isUserUnfollowedEditorialCommunityEvent),
);

export const follows = (getAllEvents: GetAllEvents): Follows => (userId, groupId) => pipe(
  getAllEvents,
  T.map(flow(
    RA.findLast(refineAndPredicate(isFollowsAggregateEvent, involves(userId, groupId))),
    O.filter(isUserFollowedEditorialCommunityEvent),
    O.isSome,
  )),
);

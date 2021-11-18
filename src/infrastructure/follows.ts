import * as O from 'fp-ts/Option';
import * as P from 'fp-ts/Predicate';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Refinement';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
  UserFollowedEditorialCommunityEvent,
  UserUnfollowedEditorialCommunityEvent,
} from '../domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const involves = (
  userId: UserId,
  groupId: GroupId,
) => (
  event: UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent,
) => event.editorialCommunityId === groupId && event.userId === userId;

const isEventAboutFollowingAGroup = pipe(
  isUserFollowedEditorialCommunityEvent,
  R.or(isUserUnfollowedEditorialCommunityEvent),
);

const refineAndPredicate = <A, B extends A>(refinement: R.Refinement<A, B>, predicate: P.Predicate<B>) => (
  input: A,
) => refinement(input) && predicate(input);

export const follows = (getAllEvents: GetAllEvents): Follows => (userId, groupId) => pipe(
  getAllEvents,
  T.map(flow(
    RA.findLast(refineAndPredicate(isEventAboutFollowingAGroup, involves(userId, groupId))),
    O.filter(isUserFollowedEditorialCommunityEvent),
    O.isSome,
  )),
);

import * as Eq from 'fp-ts/Eq';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { GetFollowedEditorialCommunityIds } from './get-followed-editorial-communities-from-ids';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
  UserFollowedEditorialCommunityEvent,
  UserUnfollowedEditorialCommunityEvent,
} from '../types/domain-events';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectFollowedCommunities = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent => (
    isUserFollowedEditorialCommunityEvent(event) || isUserUnfollowedEditorialCommunityEvent(event)
  )),
  RA.filter((event) => event.userId === userId),
  RA.map((event) => event.editorialCommunityId),
  RA.uniq(Eq.fromEquals((a, b) => a.value === b.value)),
);

export const createProjectFollowedEditorialCommunityIds = (
  getAllEvents: GetAllEvents,
): GetFollowedEditorialCommunityIds => (
  (userId) => pipe(
    getAllEvents,
    T.map(projectFollowedCommunities(userId)),
  )
);

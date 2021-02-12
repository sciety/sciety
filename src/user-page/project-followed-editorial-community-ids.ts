import * as RA from 'fp-ts/ReadonlyArray';
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

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectFollowedCommunities = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent => (
    isUserFollowedEditorialCommunityEvent(event) || isUserUnfollowedEditorialCommunityEvent(event)
  )),
  RA.filter((event) => event.userId === userId),
  RA.map((event) => event.editorialCommunityId),
  RA.uniq(eqEditorialCommunityId),
);

type ProjectFollowedEditorialCommunityIds = (userId: UserId) => T.Task<ReadonlyArray<EditorialCommunityId>>;

export const projectFollowedEditorialCommunityIds = (
  getAllEvents: GetAllEvents,
): ProjectFollowedEditorialCommunityIds => (userId) => pipe(
  getAllEvents,
  T.map(projectFollowedCommunities(userId)),
);

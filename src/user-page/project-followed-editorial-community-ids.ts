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
import { eqGroupId, GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectFollowedCommunities = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter((event): event is UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent => (
    isUserFollowedEditorialCommunityEvent(event) || isUserUnfollowedEditorialCommunityEvent(event)
  )),
  RA.filter((event) => event.userId === userId),
  RA.map((event) => event.editorialCommunityId),
  RA.uniq(eqGroupId),
);

type ProjectFollowedGroupIds = (userId: UserId) => T.Task<ReadonlyArray<GroupId>>;

export const projectFollowedGroupIds = (
  getAllEvents: GetAllEvents,
): ProjectFollowedGroupIds => (userId) => pipe(
  getAllEvents,
  T.map(projectFollowedCommunities(userId)),
);

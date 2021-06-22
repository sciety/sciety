import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent, UserFollowedEditorialCommunityEvent, UserUnfollowedEditorialCommunityEvent,
} from '../../types/domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type FollowedGroups = (events: ReadonlyArray<DomainEvent>) => (userId: UserId) => ReadonlyArray<GroupId>;
type FollowOrUnfollowEvent = UserFollowedEditorialCommunityEvent | UserUnfollowedEditorialCommunityEvent;

const reduceFollowOrUnfollowEventToGroupIds = (
  state: ReadonlyArray<GroupId>,
  event: FollowOrUnfollowEvent,
): ReadonlyArray<GroupId> => pipe(
  event.editorialCommunityId,
  (groupId) => match(event.type)
    .with('UserFollowedEditorialCommunity', () => [...state, groupId])
    .with('UserUnfollowedEditorialCommunity', () => pipe(state, RA.filter((existing) => existing !== groupId)))
    .exhaustive(),
);

const isFollowOrUnfollowEventForUser = (userId: UserId) => (event: DomainEvent): event is FollowOrUnfollowEvent => (
  (
    isUserFollowedEditorialCommunityEvent(event) || isUserUnfollowedEditorialCommunityEvent(event)
  )
  && event.userId === userId
);

export const followedGroups: FollowedGroups = (events) => (userId) => pipe(
  events,
  RA.filter(isFollowOrUnfollowEventForUser(userId)),
  RA.reduce(RA.empty, reduceFollowOrUnfollowEventToGroupIds),
);

import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

const calculateFollowedGroupCounts = (
  events: ReadonlyArray<DomainEvent>,
  userIds: ReadonlyArray<UserId>,
) => pipe(
  events,
  RA.reduce(new Map<UserId, number>(), (state, event) => {
    if (isUserFollowedEditorialCommunityEvent(event) && userIds.includes(event.userId)) {
      return state.set(event.userId, (state.get(event.userId) ?? 0) + 1);
    }
    return state;
  }),
);

export const findFollowers: FindFollowers = (groupId) => (events) => pipe(
  events,
  RA.reduce([], (state: ReadonlyArray<UserId>, event) => {
    if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
      return [...state, event.userId];
    }
    if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
      return state.filter((userId) => userId !== event.userId);
    }
    return state;
  }),
  (userIds) => ({
    userIds,
    followedGroupCounts: calculateFollowedGroupCounts(events, userIds),
  }),
  ({ userIds, followedGroupCounts }) => pipe(
    userIds,
    RA.map((userId) => ({
      userId,
      followedGroupCount: followedGroupCounts.get(userId) ?? 0,
      listCount: 1,
    })),
    RA.reverse,
  ),
);

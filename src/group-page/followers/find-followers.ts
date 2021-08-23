import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

const calculateFollowedGroupCounts = (
  groupId: GroupId,
  events: ReadonlyArray<DomainEvent>,
  userIds: ReadonlyArray<UserId>,
) => new Map(userIds.map((id) => [id, 1]));

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
    followedGroupCounts: calculateFollowedGroupCounts(groupId, events, userIds),
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

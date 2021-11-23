import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { condWithRefinement } from '../../utilities';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

const calculateFollowerUserIds = (
  groupId: GroupId,
) => RA.reduce([], (state: ReadonlyArray<UserId>, event: DomainEvent) => {
  if (isUserFollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
    return [...state, event.userId];
  }
  if (isUserUnfollowedEditorialCommunityEvent(event) && event.editorialCommunityId === groupId) {
    return state.filter((userId) => userId !== event.userId);
  }
  return state;
});

const calculateFollowedGroupCounts = (
  events: ReadonlyArray<DomainEvent>,
  userIds: ReadonlyArray<UserId>,
) => pipe(
  events,
  RA.reduce(new Map<UserId, number>(), (state, event) => pipe(
    event,
    condWithRefinement(
      () => state,
      [
        [
          isUserFollowedEditorialCommunityEvent,
          (e) => userIds.includes(e.userId),
          (e) => state.set(e.userId, (state.get(e.userId) ?? 0) + 1),
        ],
        [
          isUserUnfollowedEditorialCommunityEvent,
          (e) => userIds.includes(e.userId),
          (e) => state.set(e.userId, (state.get(e.userId) ?? 0) - 1),
        ],
      ],
    ),
  )),
);

export const findFollowers: FindFollowers = (groupId) => (events) => pipe(
  events,
  calculateFollowerUserIds(groupId),
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

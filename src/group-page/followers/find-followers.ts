import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../../domain-events';
import { getGroupIdsFollowedBy } from '../../shared-read-models/followings';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

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

export const findFollowers: FindFollowers = (groupId) => (events) => pipe(
  events,
  calculateFollowerUserIds(groupId),
  RA.map((userId) => ({
    userId,
    followedGroupCount: pipe(
      events,
      getGroupIdsFollowedBy(userId),
      RA.size,
    ),
    listCount: 1,
  })),
  RA.reverse,
);

import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './augment-with-user-details';
import { DomainEvent } from '../../domain-events';
import { getGroupIdsFollowedBy, getUsersFollowing } from '../../shared-read-models/followings';
import { GroupId } from '../../types/group-id';

type FindFollowers = (groupId: GroupId) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (groupId) => (events) => pipe(
  events,
  getUsersFollowing(groupId),
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

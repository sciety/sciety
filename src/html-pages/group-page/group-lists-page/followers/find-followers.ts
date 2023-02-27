import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../../../../types/group-id';
import { GetFollowers, GetGroupsFollowedBy } from '../../../../shared-ports';
import { Follower } from '../view-model';

export type Ports = {
  getFollowers: GetFollowers,
  getGroupsFollowedBy: GetGroupsFollowedBy,
};

type FindFollowers = (ports: Ports) => (groupId: GroupId) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (ports) => (groupId) => pipe(
  ports.getFollowers(groupId),
  RA.map((userId) => ({
    userId,
    followedGroupCount: pipe(
      ports.getGroupsFollowedBy(userId),
      RA.size,
    ),
    listCount: 1,
  })),
  RA.reverse,
);

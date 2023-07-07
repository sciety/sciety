import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../../../../types/group-id';
import { Follower } from '../view-model';
import * as LOID from '../../../../types/list-owner-id';
import { Queries } from '../../../../shared-read-models';

export type Ports = Pick<Queries, 'getFollowers' | 'getGroupsFollowedBy' | 'selectAllListsOwnedBy'>;

type FindFollowers = (dependencies: Ports) => (groupId: GroupId) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (dependencies) => (groupId) => pipe(
  dependencies.getFollowers(groupId),
  RA.map((userId) => ({
    userId,
    followedGroupCount: pipe(
      dependencies.getGroupsFollowedBy(userId),
      RA.size,
    ),
    listCount: pipe(
      dependencies.selectAllListsOwnedBy(LOID.fromUserId(userId)),
      RA.size,
    ),
  })),
  RA.reverse,
);

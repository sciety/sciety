import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../../../../types/group-id';
import { Follower } from '../view-model';
import * as LOID from '../../../../types/list-owner-id';
import { Queries } from '../../../../shared-read-models';

export type Ports = Pick<Queries, 'getFollowers' | 'getGroupsFollowedBy' | 'selectAllListsOwnedBy'>;

type FindFollowers = (ports: Ports) => (groupId: GroupId) => ReadonlyArray<Follower>;

export const findFollowers: FindFollowers = (ports) => (groupId) => pipe(
  ports.getFollowers(groupId),
  RA.map((userId) => ({
    userId,
    followedGroupCount: pipe(
      ports.getGroupsFollowedBy(userId),
      RA.size,
    ),
    listCount: pipe(
      ports.selectAllListsOwnedBy(LOID.fromUserId(userId)),
      RA.size,
    ),
  })),
  RA.reverse,
);

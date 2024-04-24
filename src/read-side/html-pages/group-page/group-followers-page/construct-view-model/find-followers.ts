import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { Follower } from './follower';
import { GroupId } from '../../../../../types/group-id';
import * as LOID from '../../../../../types/list-owner-id';

type FindFollowers = (dependencies: Dependencies) => (groupId: GroupId) => ReadonlyArray<Follower>;

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

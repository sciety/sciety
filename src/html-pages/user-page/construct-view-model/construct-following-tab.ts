import * as TO from 'fp-ts/TaskOption';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { FollowingTab } from '../view-model';
import { populateGroupViewModel, Ports } from '../../../shared-components/group-card';
import { GroupId } from '../../../types/group-id';

export { Ports } from '../../../shared-components/group-card';

type Following = {
  groupId: GroupId,
  followedAt: Date,
};

export const constructFollowingTab = (ports: Ports, followings: ReadonlyArray<Following>): T.Task<FollowingTab> => pipe(
  followings,
  RA.map((following) => following.groupId),
  TE.traverseArray(populateGroupViewModel(ports)),
  TO.fromTaskEither,
  T.map((f) => ({
    selector: 'followed-groups',
    followedGroups: f,
  })),
);

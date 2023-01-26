import * as TO from 'fp-ts/TaskOption';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FollowingTab } from '../view-model';
import { populateGroupViewModel, Ports } from '../../../shared-components/group-card';
import { GroupId } from '../../../types/group-id';

export { Ports } from '../../../shared-components/group-card';

export const constructFollowingTab = (ports: Ports, groupIds: ReadonlyArray<GroupId>): T.Task<FollowingTab> => pipe(
  groupIds,
  TE.traverseArray(populateGroupViewModel(ports)),
  TO.fromTaskEither,
  T.map((f) => ({
    selector: 'followed-groups',
    followedGroups: f,
  })),
);

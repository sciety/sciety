import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { FollowingTab } from '../view-model';
import { constructGroupCardViewModel, Ports } from '../../../shared-components/group-card';
import { GroupId } from '../../../types/group-id';

export { Ports } from '../../../shared-components/group-card';

type Following = {
  groupId: GroupId,
  followedAt: Date,
};

export const constructFollowingTab = (ports: Ports, followings: ReadonlyArray<Following>): T.Task<FollowingTab> => pipe(
  followings,
  RA.map((following) => following.groupId),
  E.traverseArray(constructGroupCardViewModel(ports)),
  O.fromEither,
  (f) => ({
    selector: 'followed-groups' as const,
    followedGroups: f,
  }),
  T.of,
);

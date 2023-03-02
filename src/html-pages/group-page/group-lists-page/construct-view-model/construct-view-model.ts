import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as RA from 'fp-ts/ReadonlyArray';
import {
  GetFollowers, GetGroupBySlug, IsFollowing, SelectAllListsOwnedBy,
} from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { TabsViewModel, ViewModel } from '../view-model';
import { findFollowers, Ports as FindFollowersPorts } from './find-followers';
import { constructListCards, Ports as ConstructListCardsPorts } from './construct-list-cards';
import { Group } from '../../../../types/group';
import * as LOID from '../../../../types/list-owner-id';

type TabsViewModelPorts = {
  getFollowers: GetFollowers,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructTabsViewModel = (ports: TabsViewModelPorts, group: Group): TabsViewModel => ({
  groupSlug: group.slug,
  listCount: pipe(
    group.id,
    LOID.fromGroupId,
    ports.selectAllListsOwnedBy,
    RA.size,
  ),
  followerCount: pipe(
    ports.getFollowers(group.id),
    RA.size,
  ),
});

export type Ports = FindFollowersPorts & ConstructListCardsPorts & {
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
};

export const paramsCodec = t.type({
  slug: t.string,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof paramsCodec>;

type ConstructViewModel = (ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  ports.getGroupBySlug(params.slug),
  O.map((group) => pipe(
    {
      group,
      isFollowing: pipe(
        params.user,
        O.fold(
          () => false,
          (u) => ports.isFollowing(group.id)(u.id),
        ),
      ),
      followers: findFollowers(ports)(group.id),
      lists: constructListCards(ports, group),
      listCards: constructListCards(ports, group),
      tabs: constructTabsViewModel(ports, group),
    },
  )),
  TE.fromOption(() => DE.notFound),
);

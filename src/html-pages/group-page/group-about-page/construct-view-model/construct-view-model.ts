import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { sequenceS } from 'fp-ts/Apply';
import * as LOID from '../../../../types/list-owner-id';
import {
  FetchStaticFile, GetGroupBySlug, IsFollowing, SelectAllListsOwnedBy,
} from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { ViewModel } from '../view-model';
import { constructTabsViewModel, Ports as TabsViewModelPorts } from '../../common-components/tabs-view-model';
import { toOurListsViewModel } from './to-our-lists-view-model';

export type Ports = TabsViewModelPorts & {
  fetchStaticFile: FetchStaticFile,
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
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
      tabs: constructTabsViewModel(ports, group),
    },
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partial) => pipe(
    {
      ourLists: pipe(
        partial.group.id,
        LOID.fromGroupId,
        ports.selectAllListsOwnedBy,
        toOurListsViewModel(partial.group.slug),
        TE.right,
      ),
      markdown: ports.fetchStaticFile(`groups/${partial.group.descriptionPath}`),
    },
    sequenceS(TE.ApplyPar),
    TE.map((activeTab) => ({
      ...partial,
      activeTab,
    })),
  )),
);

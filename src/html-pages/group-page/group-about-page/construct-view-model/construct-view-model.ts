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
import { AboutTab, ViewModel } from '../view-model';
import { ContentModel } from '../content-model';
import { constructTabsViewModel, Ports as TabsViewModelPorts } from '../../common-components/tabs-view-model';
import { toOurListsViewModel } from './to-our-lists-view-model';

export type Ports = TabsViewModelPorts & {
  fetchStaticFile: FetchStaticFile,
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructActiveTabModel = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, AboutTab> => pipe(
  {
    ourLists: pipe(
      contentModel.lists,
      toOurListsViewModel(contentModel.group.slug),
      TE.right,
    ),
    markdown: ports.fetchStaticFile(`groups/${contentModel.group.descriptionPath}`),
  },
  sequenceS(TE.ApplyPar),
);

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
      lists: pipe(
        group.id,
        LOID.fromGroupId,
        ports.selectAllListsOwnedBy,
      ),
    },
  )),
  TE.fromOption(() => DE.notFound),
  TE.chain((partial) => pipe(
    partial,
    constructActiveTabModel(ports),
    TE.map((activeTab) => ({
      ...partial,
      activeTab,
    })),
  )),
);

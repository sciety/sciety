import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as LOID from '../../../../types/list-owner-id';
import { GetGroupBySlug, IsFollowing, SelectAllListsOwnedBy } from '../../../../shared-ports';
import { userIdCodec } from '../../../../types/user-id';
import * as DE from '../../../../types/data-error';
import { AboutTab, ViewModel } from '../view-model';
import { ContentModel } from '../content-model';
import { constructAboutTab, Ports as AboutPorts } from './about';
import { constructTabsViewModel, Ports as TabsViewModelPorts } from '../../common-components/tabs-view-model';

export type Ports = AboutPorts & TabsViewModelPorts & {
  getGroupBySlug: GetGroupBySlug,
  isFollowing: IsFollowing,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const constructActiveTabModel = (
  ports: Ports,
) => (contentModel: ContentModel): TE.TaskEither<DE.DataError, AboutTab> => pipe(
  contentModel,
  constructAboutTab(ports),
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

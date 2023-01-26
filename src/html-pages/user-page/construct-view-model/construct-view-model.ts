import { sequenceS } from 'fp-ts/Apply';
import * as TO from 'fp-ts/TaskOption';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetUserViaHandle, SelectAllListsOwnedBy } from '../../../shared-ports';
import { getGroupIdsFollowedBy } from '../../../shared-read-models/followings';
import * as DE from '../../../types/data-error';
import * as LOID from '../../../types/list-owner-id';
import { FollowingTab, ListsTab, ViewModel } from '../view-model';
import { List } from '../../../types/list';
import { userHandleCodec } from '../../../types/user-handle';
import { populateGroupViewModel, Ports as PopulateGroupViewModelPorts } from '../../../shared-components/group-card/populate-group-view-model';
import { GroupId } from '../../../types/group-id';

const constructListsTab = (list: List): ListsTab => ({
  selector: 'lists',
  listId: list.id,
  articleCount: list.articleIds.length,
  lastUpdated: O.some(list.lastUpdated),
  title: list.name,
  description: list.description,
  articleCountLabel: 'This list contains',
});

const constructFollowingTab = (ports: Ports, groupIds: ReadonlyArray<GroupId>): T.Task<FollowingTab> => pipe(
  groupIds,
  TE.traverseArray(populateGroupViewModel(ports)),
  TO.fromTaskEither,
  T.map((f) => ({
    selector: 'followed-groups',
    followedGroups: f,
  })),
);

export type Ports = PopulateGroupViewModelPorts & {
  getUserViaHandle: GetUserViaHandle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const userPageParams = t.type({
  handle: userHandleCodec,
});

export type Params = t.TypeOf<typeof userPageParams>;

type ConstructViewModel = (tab: string, ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (tab, ports) => (params) => pipe(
  params.handle,
  ports.getUserViaHandle,
  TE.fromOption(() => DE.notFound),
  TE.chainW((user) => pipe(
    {
      groupIds: pipe(
        ports.getAllEvents,
        T.map(getGroupIdsFollowedBy(user.id)),
        TE.rightTask,
      ),
      userDetails: TE.right(user),
      activeTabIndex: TE.right(tab === 'lists' ? 0 as const : 1 as const),
      list: pipe(
        user.id,
        LOID.fromUserId,
        ports.selectAllListsOwnedBy,
        RA.head,
        E.fromOption(() => DE.notFound),
        T.of,
      ),
    },
    sequenceS(TE.ApplyPar),
  )),
  TE.chainTaskK((model) => pipe(
    ({
      inputs: T.of(model),
      activeTab: (tab === 'lists' ? T.of(constructListsTab(model.list)) : constructFollowingTab(ports, model.groupIds)),
    }),
    sequenceS(T.ApplyPar),
  )),
  TE.map(({ inputs, activeTab }) => ({
    ...inputs,
    activeTab,
  })),
);

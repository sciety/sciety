import { sequenceS } from 'fp-ts/Apply';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetGroupsFollowedBy, LookupUser, SelectAllListsOwnedBy } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import * as LOID from '../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { userHandleCodec } from '../../../types/user-handle';
import { constructListsTab } from './construct-lists-tab';
import { constructFollowingTab, Ports as ConstructFollowingTabPorts } from './construct-following-tab';

export type Ports = ConstructFollowingTabPorts & {
  getGroupsFollowedBy: GetGroupsFollowedBy,
  lookupUser: LookupUser,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const userPageParams = t.type({
  handle: userHandleCodec,
});

export type Params = t.TypeOf<typeof userPageParams>;

type ConstructViewModel = (tab: string, ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (tab, ports) => (params) => pipe(
  params.handle,
  ports.lookupUser,
  E.fromOption(() => DE.notFound),
  E.chain((user) => pipe(
    {
      groupIds: pipe(
        ports.getGroupsFollowedBy(user.id),
        E.right,
      ),
      userDetails: E.right(user),
      list: pipe(
        user.id,
        LOID.fromUserId,
        ports.selectAllListsOwnedBy,
        RA.head,
        E.fromOption(() => DE.notFound),
      ),
    },
    sequenceS(E.Apply),
  )),
  TE.fromEither,
  TE.chainTaskK(({ groupIds, userDetails, list }) => pipe(
    ({
      groupIds: T.of(groupIds),
      userDetails: T.of(userDetails),
      list: T.of(list),
      activeTab: (tab === 'lists' ? T.of(constructListsTab(list)) : constructFollowingTab(ports, groupIds)),
    }),
    sequenceS(T.ApplyPar),
  )),
);

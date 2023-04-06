import { sequenceS } from 'fp-ts/Apply';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import * as RA from 'fp-ts/ReadonlyArray';
import { GetGroupsFollowedBy, LookupUserByHandle, SelectAllListsOwnedBy } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import * as LOID from '../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { constructListsTab } from './construct-lists-tab';
import { constructFollowingTab, Ports as ConstructFollowingTabPorts } from './construct-following-tab';
import { candidateUserHandleCodec } from '../../../types/candidate-user-handle';
import { userIdCodec } from '../../../types/user-id';

export type Ports = ConstructFollowingTabPorts & {
  getGroupsFollowedBy: GetGroupsFollowedBy,
  lookupUserByHandle: LookupUserByHandle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const userPageParams = t.type({
  handle: candidateUserHandleCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof userPageParams>;

type ConstructViewModel = (tab: string, ports: Ports) => (params: Params) => TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (tab, ports) => (params) => pipe(
  params.handle,
  ports.lookupUserByHandle,
  E.fromOption(() => DE.notFound),
  E.map((user) => ({
    groupIds: ports.getGroupsFollowedBy(user.id),
    userDetails: user,
    lists: ports.selectAllListsOwnedBy(LOID.fromUserId(user.id)),
  })),
  TE.fromEither,
  TE.chainTaskK(({ groupIds, userDetails, lists }) => pipe(
    {
      groupIds: T.of(groupIds),
      userDetails: T.of(userDetails),
      listCount: T.of(lists.length),
      activeTab: (tab === 'lists' ? T.of(
        constructListsTab(
          lists,
          userDetails.id,
          pipe(
            params.user,
            O.map((user) => user.id),
          ),
        ),
      ) : pipe(
        groupIds,
        RA.map((groupId) => ({
          groupId,
          followedAt: new Date(),
        })),
        (followings) => constructFollowingTab(ports, followings),
      )
      ),
    },
    sequenceS(T.ApplyPar),
  )),
);

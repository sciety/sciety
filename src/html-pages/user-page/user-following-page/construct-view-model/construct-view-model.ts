import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import * as RA from 'fp-ts/ReadonlyArray';
import { GetGroupsFollowedBy, LookupUserByHandle, SelectAllListsOwnedBy } from '../../../../shared-ports';
import * as DE from '../../../../types/data-error';
import * as LOID from '../../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { constructFollowingTab, Ports as ConstructFollowingTabPorts } from './construct-following-tab';
import { candidateUserHandleCodec } from '../../../../types/candidate-user-handle';
import { userIdCodec } from '../../../../types/user-id';

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

type ConstructViewModel = (ports: Ports)
=> (params: Params)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (ports) => (params) => pipe(
  params.handle,
  ports.lookupUserByHandle,
  E.fromOption(() => DE.notFound),
  E.map((user) => ({
    groupIds: ports.getGroupsFollowedBy(user.id),
    userDetails: user,
    lists: ports.selectAllListsOwnedBy(LOID.fromUserId(user.id)),
  })),
  E.map(({ groupIds, userDetails, lists }) => ({
    groupIds,
    userDetails,
    listCount: lists.length,
    activeTab: pipe(
      groupIds,
      RA.map((groupId) => ({
        groupId,
        followedAt: new Date(),
      })),
      (followings) => constructFollowingTab(ports, followings),
    ),
  })),
  TE.fromEither,
);

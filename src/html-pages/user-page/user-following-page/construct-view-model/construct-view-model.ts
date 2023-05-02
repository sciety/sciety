import * as O from 'fp-ts/Option';
import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetGroupsFollowedBy, LookupUserByHandle, SelectAllListsOwnedBy } from '../../../../shared-ports';
import * as DE from '../../../../types/data-error';
import * as LOID from '../../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { candidateUserHandleCodec } from '../../../../types/candidate-user-handle';
import { constructGroupCardViewModel, Ports as ConstructGroupCardViewModelPorts } from '../../../../shared-components/group-card';

export type Ports = ConstructGroupCardViewModelPorts & {
  getGroupsFollowedBy: GetGroupsFollowedBy,
  lookupUserByHandle: LookupUserByHandle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const userPageParams = t.type({
  handle: candidateUserHandleCodec,
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
    followedGroups: pipe(
      groupIds,
      E.traverseArray(constructGroupCardViewModel(ports)),
      O.fromEither,
    ),
  })),
  TE.fromEither,
);

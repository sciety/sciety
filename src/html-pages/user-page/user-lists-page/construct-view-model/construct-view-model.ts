import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import * as DE from '../../../../types/data-error';
import * as LOID from '../../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { constructListsTab } from './construct-lists-tab';
import { candidateUserHandleCodec } from '../../../../types/candidate-user-handle';
import { userIdCodec } from '../../../../types/user-id';
import { Queries } from '../../../../shared-read-models';

export type Ports = Queries;

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
    ...constructListsTab(
      lists,
      userDetails.id,
      pipe(
        params.user,
        O.map((user) => user.id),
      ),
    ),
  })),
  TE.fromEither,
);

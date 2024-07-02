import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { constructListsTab } from './construct-lists-tab';
import { candidateUserHandleCodec } from '../../../../../types/candidate-user-handle';
import * as DE from '../../../../../types/data-error';
import * as LOID from '../../../../../types/list-owner-id';
import { userIdCodec } from '../../../../../types/user-id';
import { ConstructViewModel } from '../../../construct-view-model';
import { ViewModel } from '../view-model';

export const userPageParams = t.type({
  handle: candidateUserHandleCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof userPageParams>;

export const constructViewModel: ConstructViewModel<Params, ViewModel> = (dependencies) => (params) => pipe(
  params.handle,
  dependencies.lookupUserByHandle,
  E.fromOption(() => DE.notFound),
  E.map((user) => ({
    groupIds: dependencies.getGroupsFollowedBy(user.id),
    userDetails: user,
    lists: dependencies.selectAllListsOwnedBy(LOID.fromUserId(user.id)),
  })),
  E.map(({ groupIds, userDetails, lists }) => ({
    groupIds,
    userDetails,
    listCount: lists.length,
    ...constructListsTab(
      lists,
      userDetails,
      pipe(
        params.user,
        O.map((user) => user.id),
      ),
    ),
  })),
  TE.fromEither,
);

import * as t from 'io-ts';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as tt from 'io-ts-types';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as DE from '../../../../types/data-error';
import * as LOID from '../../../../types/list-owner-id';
import { ViewModel } from '../view-model';
import { candidateUserHandleCodec } from '../../../../types/candidate-user-handle';
import { userIdCodec, UserId } from '../../../../types/user-id';
import { Queries } from '../../../../shared-read-models';

import { sortByDefaultListOrdering } from '../../../sort-by-default-list-ordering';
import { constructListCardViewModelWithoutAvatar } from '../../../../shared-components/list-card';

const showCreateNewList = (pageOwner: UserId, loggedInUser: O.Option<UserId>) => pipe(
  loggedInUser,
  O.filter((loggedInUserId) => loggedInUserId === pageOwner),
  O.isSome,
);

export const userPageParams = t.type({
  handle: candidateUserHandleCodec,
  user: tt.optionFromNullable(t.type({
    id: userIdCodec,
  })),
});

export type Params = t.TypeOf<typeof userPageParams>;

type ConstructViewModel = (queries: Queries)
=> (params: Params)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const constructViewModel: ConstructViewModel = (queries) => (params) => pipe(
  params.handle,
  queries.lookupUserByHandle,
  E.fromOption(() => DE.notFound),
  E.map((user) => ({
    groupIds: queries.getGroupsFollowedBy(user.id),
    userDetails: user,
    lists: queries.selectAllListsOwnedBy(LOID.fromUserId(user.id)),
  })),
  E.map(({ groupIds, userDetails, lists }) => ({
    groupIds,
    userDetails,
    listCount: lists.length,
    ownedLists: pipe(
      lists,
      sortByDefaultListOrdering,
      RA.map(constructListCardViewModelWithoutAvatar),
    ),
    showCreateNewList: showCreateNewList(userDetails.id, pipe(
      params.user,
      O.map((user) => user.id),
    )),
  })),
  TE.fromEither,
);

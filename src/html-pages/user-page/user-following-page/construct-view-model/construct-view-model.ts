import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Queries } from '../../../../read-models';
import { constructGroupCard } from '../../../../shared-components/group-card';
import { candidateUserHandleCodec } from '../../../../types/candidate-user-handle';
import * as DE from '../../../../types/data-error';
import * as LOID from '../../../../types/list-owner-id';
import { ViewModel } from '../view-model';

export const userPageParams = t.type({
  handle: candidateUserHandleCodec,
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
    followedGroups: pipe(
      groupIds,
      E.traverseArray(constructGroupCard(queries)),
      O.fromEither,
    ),
  })),
  TE.fromEither,
);

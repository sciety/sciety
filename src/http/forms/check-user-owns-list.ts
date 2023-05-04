import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';
import { Queries } from '../../shared-read-models';

export type Ports = {
  lookupList: Queries['lookupList'],
};

export const checkUserOwnsList = (adapters: Ports, listId: ListId, userId: UserId) => pipe(
  listId,
  adapters.lookupList,
  TE.fromOption(() => ({
    message: 'List id not found',
    payload: { listId, userId },
  })),
  TE.filterOrElseW(
    (list) => LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId)),
    (list) => ({
      message: 'List owner id does not match user id',
      payload: {
        listId: list.id,
        listOwnerId: list.ownerId,
        userId,
      },
    }),
  ),
);

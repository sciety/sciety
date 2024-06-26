import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Queries } from '../../read-models';
import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export type Dependencies = Queries;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const checkUserOwnsList = (dependencies: Dependencies, listId: ListId, userId: UserId) => pipe(
  listId,
  dependencies.lookupList,
  E.fromOption(() => ({
    message: 'List id not found',
    payload: { listId, userId },
  })),
  E.filterOrElseW(
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

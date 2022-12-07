import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetList } from '../../shared-ports';
import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export type CheckUserOwnsListPorts = {
  getList: GetList,
};

export const checkUserOwnsList = (adapters: CheckUserOwnsListPorts, listId: ListId, userId: UserId) => pipe(
  listId,
  adapters.getList,
  TE.fromOption(() => ({
    message: 'List id not found',
    payload: { listId, userId },
  })),
  TE.filterOrElseW(
    (list) => LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId)),
    (list) => ({
      message: 'List owner id does not match user id',
      payload: {
        listId: list.listId,
        listOwnerId: list.ownerId,
        userId,
      },
    }),
  ),
);

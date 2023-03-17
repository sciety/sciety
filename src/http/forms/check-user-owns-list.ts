import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { LookupList } from '../../shared-ports';
import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';
import { FormHandlingError } from './form-handling-error';

export type Ports = {
  lookupList: LookupList,
};

export const checkUserOwnsList = (
  adapters: Ports,
  listId: ListId,
  userId: UserId,
): TE.TaskEither<FormHandlingError<'list-id-not-found' | 'list-ownership-check-failed'>, unknown> => pipe(
  listId,
  adapters.lookupList,
  TE.fromOption(() => ({
    errorType: 'list-id-not-found' as const,
    payload: { listId, userId },
  })),
  TE.filterOrElseW(
    (list) => LOID.eqListOwnerId.equals(list.ownerId, LOID.fromUserId(userId)),
    (list) => ({
      errorType: 'list-ownership-check-failed' as const,
      payload: {
        listId: list.id,
        listOwnerId: list.ownerId,
        userId,
      },
    }),
  ),
);

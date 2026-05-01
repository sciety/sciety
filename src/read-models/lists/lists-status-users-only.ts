import { Json } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { isGroupId } from '../../types/list-owner-id';

export const listsStatusUsersOnly = (readModel: ReadModel) => (): Json => pipe(
  Object.values(readModel.byListId),
  RA.partition((list) => !isGroupId(list.ownerId)),
  ({ right }) => ({
    ownedByUsers: pipe(
      right,
      RA.partition((userList) => userList.entries.length > 0),
      (partitioned) => ({
        empty: partitioned.left.length,
        nonEmpty: partitioned.right.length,
      }),
    ),
  }),
);

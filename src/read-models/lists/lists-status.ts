import { Json } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { isGroupId } from '../../types/list-owner-id';

export const listsStatus = (readModel: ReadModel) => (): Json => pipe(
  Object.values(readModel.byListId),
  RA.partition((list) => isGroupId(list.ownerId)),
  ({ left, right }) => ({
    ownedByGroups: {
      total: right.length,
    },
    ownedByUsers: pipe(
      left,
      RA.partition((userList) => userList.entries.size > 0),
      (partitioned) => ({
        empty: partitioned.left.length,
        nonEmpty: partitioned.right.length,
      }),
    ),
  }),
);

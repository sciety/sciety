import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel, toList } from './handle-event';
import { List } from './list';
import * as LOID from '../../types/list-owner-id';

type SelectAllListsOwnedBy = (listOwnerId: LOID.ListOwnerId) => ReadonlyArray<List>;

export const selectAllListsOwnedBy = (
  readModel: ReadModel,
): SelectAllListsOwnedBy => (listOwnerId) => pipe(
  Object.values(readModel.byListId),
  RA.map(toList),
  RA.filter((list) => LOID.eqListOwnerId.equals(list.ownerId, listOwnerId)),
);

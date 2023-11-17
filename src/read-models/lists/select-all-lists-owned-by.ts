import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import * as LOID from '../../types/list-owner-id.js';
import { List } from '../../types/list.js';

type SelectAllListsOwnedBy = (listOwnerId: LOID.ListOwnerId) => ReadonlyArray<List>;

export const selectAllListsOwnedBy = (
  readModel: ReadModel,
): SelectAllListsOwnedBy => (listOwnerId) => pipe(
  Object.values(readModel),
  RA.filter((list) => LOID.eqListOwnerId.equals(list.ownerId, listOwnerId)),
);

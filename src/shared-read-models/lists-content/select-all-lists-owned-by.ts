import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { SelectAllListsOwnedBy } from '../../shared-ports';
import * as LOID from '../../types/list-owner-id';

export const selectAllListsOwnedBy = (
  readModel: ReadModel,
): SelectAllListsOwnedBy => (listOwnerId) => pipe(
  Object.values(readModel),
  RA.filter((list) => LOID.eqListOwnerId.equals(list.ownerId, listOwnerId)),
);

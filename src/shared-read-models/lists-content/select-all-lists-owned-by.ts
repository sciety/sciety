import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListState, ReadModel } from './handle-event';
import { SelectAllListsOwnedBy } from '../../shared-ports';
import * as LOID from '../../types/list-owner-id';

const byDate: Ord.Ord<ListState> = pipe(
  D.Ord,
  Ord.contramap((listState) => listState.lastUpdated),
);

export const selectAllListsOwnedBy = (
  readModel: ReadModel,
): SelectAllListsOwnedBy => (listOwnerId) => pipe(
  Object.values(readModel),
  RA.filter((list) => LOID.eqListOwnerId.equals(list.ownerId, listOwnerId)),
  RA.sort(byDate),
);

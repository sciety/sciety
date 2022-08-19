import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { constructReadModel } from './construct-read-model';
import { List } from './list';
import { DomainEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { eqListOwnerId, ListOwnerId } from '../../types/list-owner-id';

type SelectAllListsOwnedBy = (ownerId: ListOwnerId)
=> (events: ReadonlyArray<DomainEvent>)
=> TE.TaskEither<DE.DataError, ReadonlyArray<List>>;

const orderByLastUpdatedDescending: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((list) => list.lastUpdated),
);

export const selectAllListsOwnedBy: SelectAllListsOwnedBy = (ownerId) => (events) => pipe(
  events,
  constructReadModel,
  RM.values(orderByLastUpdatedDescending),
  RA.filter((list) => eqListOwnerId.equals(list.ownerId, ownerId)),
  T.of,
  T.delay(1),
  TE.rightTask,
);

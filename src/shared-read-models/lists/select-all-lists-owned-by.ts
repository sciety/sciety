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
import { GroupId } from '../../types/group-id';

type SelectAllListsOwnedBy = (groupId: GroupId)
=> (events: ReadonlyArray<DomainEvent>)
=> TE.TaskEither<DE.DataError, ReadonlyArray<List>>;

const orderByLastUpdatedDescending: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((list) => list.lastUpdated),
);

export const selectAllListsOwnedBy: SelectAllListsOwnedBy = (groupId) => (events) => pipe(
  events,
  constructReadModel,
  RM.values(orderByLastUpdatedDescending),
  RA.filter((list) => list.ownerId === groupId),
  T.of,
  T.delay(1),
  TE.rightTask,
);

import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RM from 'fp-ts/ReadonlyMap';
import { flow, pipe } from 'fp-ts/function';
import { ListsEvent } from './lists-event';
import { List } from '../shared-read-models/lists';
import { constructReadModel } from '../shared-read-models/lists/construct-read-model';
import { GroupId } from '../types/group-id';

const orderByLastUpdatedDescending: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((list) => list.lastUpdated),
);

type SelectAllListsOwnedBy = (groupId: GroupId) => (events: ReadonlyArray<ListsEvent>) => ReadonlyArray<List>;

export const selectAllListsOwnedBy: SelectAllListsOwnedBy = (groupId) => flow(
  constructReadModel,
  RM.filter((list) => list.ownerId === groupId),
  RM.values(orderByLastUpdatedDescending),
);

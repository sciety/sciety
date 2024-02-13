import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as Ord from 'fp-ts/Ord';
import * as D from 'fp-ts/Date';
import { List } from '../read-models/lists/list';

const byDate: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.contramap((listState) => listState.updatedAt),
);

export const sortByDefaultListOrdering = (lists: ReadonlyArray<List>): ReadonlyArray<List> => pipe(
  lists,
  RA.sort(byDate),
  RA.reverse,
);

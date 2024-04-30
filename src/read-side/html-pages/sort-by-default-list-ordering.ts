import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { byUpdatedAt, List } from '../../read-models/lists';

export const sortByDefaultListOrdering = (lists: ReadonlyArray<List>): ReadonlyArray<List> => pipe(
  lists,
  RA.sort(byUpdatedAt),
  RA.reverse,
);

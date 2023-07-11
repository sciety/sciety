import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as Ord from 'fp-ts/Ord';
import * as D from 'fp-ts/Date';

type HasUpdatedAt = {
  updatedAt: Date,
};

const byDate = <HU extends HasUpdatedAt>(): Ord.Ord<HU> => pipe(
  D.Ord,
  Ord.contramap((listState) => listState.updatedAt),
);

export const sortByDefaultListOrdering = <HU extends HasUpdatedAt>(lists: ReadonlyArray<HU>): ReadonlyArray<HU> => pipe(
  lists,
  RA.sort(byDate()),
  RA.reverse,
);

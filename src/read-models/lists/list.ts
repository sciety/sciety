import { pipe } from 'fp-ts/function';
import * as D from 'fp-ts/Date';
import * as N from 'fp-ts/number';
import * as Ord from 'fp-ts/Ord';
import * as S from 'fp-ts/string';
import * as EQ from 'fp-ts/Eq';
import * as RA from 'fp-ts/ReadonlyArray';
import { ListId } from '../../types/list-id.js';
import { ListOwnerId } from '../../types/list-owner-id.js';
import { ExpressionDoi } from '../../types/expression-doi.js';

export const byUpdatedAt: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.contramap((list) => list.updatedAt),
);

export const eqList: EQ.Eq<List> = pipe(
  S.Eq,
  EQ.contramap((list) => list.id),
);

export type ListEntry = {
  expressionDoi: ExpressionDoi,
  addedAtListVersion: number,
};

export type List = {
  id: ListId,
  name: string,
  description: string,
  entries: ReadonlyArray<ListEntry>,
  updatedAt: Date,
  ownerId: ListOwnerId,
};

const listEntriesByMostRecentlyAdded: Ord.Ord<List['entries'][number]> = pipe(
  N.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.addedAtListVersion),
);

export const toExpressionDoisByMostRecentlyAdded = (entries: List['entries']): ReadonlyArray<ExpressionDoi> => pipe(
  entries,
  RA.sort(listEntriesByMostRecentlyAdded),
  RA.map((listEntry) => listEntry.expressionDoi),
);

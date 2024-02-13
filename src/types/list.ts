import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as EQ from 'fp-ts/Eq';
import { ListId } from './list-id';
import { ListOwnerId } from './list-owner-id';
import { ExpressionDoi } from './expression-doi';

export const Eq: EQ.Eq<List> = pipe(
  S.Eq,
  EQ.contramap((list) => list.id),
);

type ListEntry = {
  expressionDoi: ExpressionDoi,
};

export type List = {
  id: ListId,
  name: string,
  description: string,
  articleIds: ReadonlyArray<string>,
  entries: ReadonlyArray<ListEntry>,
  updatedAt: Date,
  ownerId: ListOwnerId,
};

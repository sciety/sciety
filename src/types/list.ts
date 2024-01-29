import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import * as EQ from 'fp-ts/Eq';
import { ListId } from './list-id';
import { ListOwnerId } from './list-owner-id';

export const Eq: EQ.Eq<List> = pipe(
  S.Eq,
  EQ.contramap((list) => list.id),
);

export type List = {
  id: ListId,
  name: string,
  description: string,
  articleIds: ReadonlyArray<string>,
  updatedAt: Date,
  ownerId: ListOwnerId,
};

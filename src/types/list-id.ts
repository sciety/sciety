import * as Eq from 'fp-ts/Eq';
import * as S from 'fp-ts/string';
import { v4 } from 'uuid';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export type ListId = string & { readonly ListId: unique symbol };

export const fromValidatedString = (value: string): ListId => value as ListId;

export const isListId = (value: unknown): value is ListId => typeof value === 'string';

export const generate = (): ListId => fromValidatedString(v4());

export const eqListId: Eq.Eq<ListId> = S.Eq;

export const listIdCodec = new t.Type(
  'listIdCodec',
  isListId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.map(fromValidatedString),
  ),
  (a) => a.toString(),
);

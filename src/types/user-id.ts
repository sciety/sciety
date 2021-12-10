import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export const userIdCodec = t.brand(
  t.string,
  (s): s is t.Branded<string, { readonly UserId: unique symbol }> => s !== '',
  'UserId',
);

export type UserId = t.TypeOf<typeof userIdCodec>;

export const isUserId = userIdCodec.is;

export const toUserId = (value: string): UserId => pipe(
  value,
  userIdCodec.decode,
  E.getOrElseW(() => { throw new Error(); }),
);

export const fromString = (value: string): O.Option<UserId> => pipe(
  value,
  userIdCodec.decode,
  O.fromEither,
);

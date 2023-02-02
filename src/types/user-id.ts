import * as t from 'io-ts';
import { identity, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export type UserId = string & { readonly UserId: unique symbol };

const isUserId = (value: unknown): value is UserId => typeof value === 'string' && value !== '';

export const userIdCodec = new t.Type(
  'UserIdFromString',
  isUserId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((value) => {
      if (isUserId(value)) {
        return t.success(value);
      }
      return t.failure(u, c);
    }),
  ),
  identity,
);

import * as t from 'io-ts';
import { identity, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export type UserId = string & { readonly UserId: unique symbol };

// ts-unused-exports:disable-next-line
export const auth0Prefix = 'auth0';

// ts-unused-exports:disable-next-line
export const twitterPrefix = 'twitter';

const isUserId = (value: unknown): value is UserId => typeof value === 'string' && value !== '';

export const userIdCodec = new t.Type(
  'UserIdFromString',
  isUserId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((value) => {
      if (isUserId(value)) {
        if (!value.includes('|')) {
          return t.success(`${twitterPrefix}|${value}` as UserId);
        }
        if (!value.match(/^(auth0|twitter)\|[^|]+$/)) {
          return t.failure(u, c);
        }
        return t.success(value);
      }
      return t.failure(u, c);
    }),
  ),
  identity,
);

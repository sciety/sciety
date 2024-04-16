import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export type UserId = string & { readonly UserId: unique symbol };

export const auth0Prefix = 'auth0';

export const twitterPrefix = 'twitter';

const isUserId = (value: unknown): value is UserId => typeof value === 'string' && value !== '';

const isEmptyString = (value: string) => value === '';
const isLegacyStyleUserId = (value: string) => !value.includes('|');
const isCurrentStyleUserId = (value: string) => value.match(/^(auth0|twitter)\|[^|]+$/);
const upgradeUserIdToCurrentStyle = (value: string) => `${twitterPrefix}|${value}`;

export const userIdCodec = new t.Type(
  'UserIdFromString',
  isUserId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain((value) => {
      if (isEmptyString(value)) {
        return t.failure(u, c);
      }
      if (isLegacyStyleUserId(value)) {
        return t.success(upgradeUserIdToCurrentStyle((value)) as UserId);
      }
      if (isCurrentStyleUserId(value)) {
        return t.success(value as UserId);
      }
      return t.failure(u, c);
    }),
  ),
  identity,
);

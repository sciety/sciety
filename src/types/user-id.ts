import * as O from 'fp-ts/Option';
import * as t from 'io-ts';
import { flow, identity, pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';

export type UserId = string & { readonly UserId: unique symbol };

const isUserId = (value: unknown): value is UserId => typeof value === 'string' && value !== '';

export const toUserId = (value: string): UserId => {
  if (isUserId(value)) {
    return value;
  }
  throw new Error();
};

const fromString = (value: string): O.Option<UserId> => O.tryCatch(() => toUserId(value));

export const UserIdFromString = new t.Type(
  'UserIdFromString',
  isUserId,
  (u, c) => pipe(
    t.string.validate(u, c),
    E.chain(flow(
      fromString,
      O.fold(
        () => t.failure(u, c),
        t.success,
      ),
    )),
  ),
  identity,
);

// ts-unused-exports:disable-next-line
export const fromValidatedString = (value: string): UserId => value as UserId;

import * as Eq from 'fp-ts/Eq';
import * as O from 'fp-ts/Option';
import * as S from 'fp-ts/string';

export type UserId = string & { readonly UserId: unique symbol };

export const isUserId = (value: unknown): value is UserId => typeof value === 'string' && value !== '';

export const toUserId = (value: string): UserId => {
  if (isUserId(value)) {
    return value;
  }
  throw new Error();
};

export const fromString = (value: string): O.Option<UserId> => O.tryCatch(() => toUserId(value));

export const eqUserId: Eq.Eq<UserId> = S.Eq;

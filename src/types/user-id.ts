import * as O from 'fp-ts/Option';

export type UserId = string & { readonly UserId: unique symbol };

export const isUserId = (value: unknown): value is UserId => typeof value === 'string' && value !== '';

export const toUserId = (value: string): UserId => {
  if (isUserId(value)) {
    return value;
  }
  throw new Error();
};

export const fromString = (value: string): O.Option<UserId> => O.tryCatch(() => toUserId(value));

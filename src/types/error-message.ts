import * as t from 'io-ts';

type ErrorMessageBrand = {
  readonly ErrorMessage: unique symbol,
};

export type ErrorMessage = string & t.Brand<ErrorMessageBrand>;

export const toErrorMessage = (value: string): ErrorMessage => value as ErrorMessage;

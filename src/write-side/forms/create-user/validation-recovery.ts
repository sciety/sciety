import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

export type ValidationRecovery<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    userInput: string,
    error: O.Option<string>,
  };
};

export const toFieldsCodec = <P extends t.Props>(props: P): t.TypeC<{ [K in keyof P]: t.StringC }> => pipe(
  props,
  R.map(() => t.string),
  (stringProps) => stringProps as {
    [K in keyof P]: t.StringC;
  },
  t.type,
);

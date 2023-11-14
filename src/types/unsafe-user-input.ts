import * as t from 'io-ts';

type UnsafeUserInputBrand = {
  readonly UnsafeUserInput: unique symbol,
};

export const toUnsafeUserInput = (value: string): UnsafeUserInput => value as UnsafeUserInput;

export const unsafeUserInputCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, UnsafeUserInputBrand> => true,
  'UnsafeUserInput',
);

export type UnsafeUserInput = t.TypeOf<typeof unsafeUserInputCodec>;

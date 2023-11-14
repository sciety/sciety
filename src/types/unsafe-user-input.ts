import * as t from 'io-ts';

type UnsafeUserInputBrand = {
  readonly UnsafeUserInput: unique symbol,
};

// ts-unused-exports:disable-next-line
export const unsafeUserInputCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, UnsafeUserInputBrand> => true,
  'UnsafeUserInput',
);

// ts-unused-exports:disable-next-line
export type UnsafeUserInput = t.TypeOf<typeof unsafeUserInputCodec>;

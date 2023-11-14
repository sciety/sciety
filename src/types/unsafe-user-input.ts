import * as t from 'io-ts';

const emptyRegex = /^[^<>"]*$/;

type UnsafeUserInputBrand = {
  readonly UnsafeUserInput: unique symbol,
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// ts-unused-exports:disable-next-line
export const unsafeUserInputCodec = () => t.brand(
  t.string,
  (input): input is t.Branded<string, UnsafeUserInputBrand> => (!!emptyRegex.exec(input)),
  'UnsafeUserInput',
);
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

// ts-unused-exports:disable-next-line
export type UnsafeUserInput = t.TypeOf<ReturnType<typeof unsafeUserInputCodec>>;

import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as B from 'fp-ts/boolean';

const notEmptyRegex = /^[^<>"]+$/;
const emptyRegex = /^[^<>"]*$/;

type UnsafeUserInputBrand = {
  readonly UnsafeUserInput: unique symbol,
};

type Config = {
  maxInputLength: number,
  allowEmptyInput?: boolean,
};

const areInputCharactersSafe = (
  config: Config,
  input: string,
) => pipe(
  config.allowEmptyInput ?? false,
  B.fold(
    () => !!notEmptyRegex.exec(input),
    () => !!emptyRegex.exec(input),
  ),
);

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// ts-unused-exports:disable-next-line
export const unsafeUserInputCodec = (config: Config) => t.brand(
  t.string,
  (input): input is t.Branded<string, UnsafeUserInputBrand> => (
    areInputCharactersSafe(config, input)
  ),
  'UnsafeUserInput',
);
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

// ts-unused-exports:disable-next-line
export type UnsafeUserInput = t.TypeOf<ReturnType<typeof unsafeUserInputCodec>>;

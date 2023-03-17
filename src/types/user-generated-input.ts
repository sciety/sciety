import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as B from 'fp-ts/boolean';

const notEmptyRegex = /^[^<>"]+$/;
const emptyRegex = /^[^<>"]*$/;

type UserGeneratedInputBrand = {
  readonly UserGeneratedInput: unique symbol,
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

export const userGeneratedInputCodec = (config: Config) => t.brand(
  t.string,
  (input): input is t.Branded<string, UserGeneratedInputBrand> => (
    areInputCharactersSafe(config, input) && input.length <= config.maxInputLength
  ),
  'UserGeneratedInput',
);

export type UserGeneratedInput = t.TypeOf<ReturnType<typeof userGeneratedInputCodec>>;

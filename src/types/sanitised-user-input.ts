import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';

const notEmptyRegex = /^[^<>"]+$/;
const emptyRegex = /^[^<>"]*$/;

type SanitisedUserInputBrand = {
  readonly SanitisedUserInput: unique symbol,
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

const isInputShortEnough = (config: Config, input: string) => input.length <= config.maxInputLength;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const sanitisedUserInputCodec = (config: Config) => t.brand(
  t.string,
  (input): input is t.Branded<string, SanitisedUserInputBrand> => (
    areInputCharactersSafe(config, input) && isInputShortEnough(config, input)
  ),
  'SanitisedUserInput',
);

export type SanitisedUserInput = t.TypeOf<ReturnType<typeof sanitisedUserInputCodec>>;

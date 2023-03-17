import * as t from 'io-ts';

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
) => !!((config.allowEmptyInput ? emptyRegex : notEmptyRegex).exec(input));

export const userGeneratedInputCodec = (config: Config) => t.brand(
  t.string,
  (input): input is t.Branded<string, UserGeneratedInputBrand> => (
    areInputCharactersSafe(config, input) && input.length <= config.maxInputLength
  ),
  'UserGeneratedInput',
);

export type UserGeneratedInput = t.TypeOf<ReturnType<typeof userGeneratedInputCodec>>;

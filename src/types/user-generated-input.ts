import * as t from 'io-ts';

const notEmptyRegex = /^[^<>"]+$/;
const emptyRegex = /^[^<>"]*$/;

type UserGeneratedInputBrand = {
  readonly UserGeneratedInput: unique symbol,
};

type Config = {
  maxLength: number,
  emptyInput?: boolean,
};

export const userGeneratedInputCodec = (config: Config) => t.brand(
  t.string,
  (input): input is t.Branded<string, UserGeneratedInputBrand> => (
    !!(
      (config.emptyInput ? emptyRegex : notEmptyRegex).exec(input)
    )
    && input.length <= config.maxLength
  ),
  'UserGeneratedInput',
);

export type UserGeneratedInput = t.TypeOf<ReturnType<typeof userGeneratedInputCodec>>;

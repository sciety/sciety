import * as t from 'io-ts';

const notEmptyRegex = /^[^<>"]+$/;
const emptyRegex = /^[^<>"]*$/;

type UserGeneratedInputBrand = {
  readonly UserGeneratedInput: unique symbol,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const userGeneratedInputCodec = (maxLength: number, emptyInput = false) => t.brand(
  t.string,
  (input): input is t.Branded<string, UserGeneratedInputBrand> => (
    !!(
      (emptyInput ? emptyRegex : notEmptyRegex).exec(input)
    )
    && input.length <= maxLength
  ),
  'UserGeneratedInput',
);

export type UserGeneratedInput = t.TypeOf<ReturnType<typeof userGeneratedInputCodec>>;

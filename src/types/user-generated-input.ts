import * as t from 'io-ts';

const regex = /^[^<>"]+$/;

type UserGeneratedInputBrand = {
  readonly UserGeneratedInput: unique symbol,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const userGeneratedInputCodec = (maxLength: number, emptyInput = false) => t.brand(
  t.string,
  (input): input is t.Branded<string, UserGeneratedInputBrand> => !!regex.exec(input) && input.length <= maxLength,
  'UserGeneratedInput',
);

export type UserGeneratedInput = t.TypeOf<ReturnType<typeof userGeneratedInputCodec>>;

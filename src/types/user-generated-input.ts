import * as t from 'io-ts';

const regex = /^[^<>"]+$/;

type UserGeneratedInputBrand = {
  readonly UserGeneratedInput: unique symbol,
};

export const userGeneratedInputCodec = (maxLength: number) => t.brand(
  t.string,
  (input): input is t.Branded<string, UserGeneratedInputBrand> => !!regex.exec(input) && input.length <= maxLength,
  'UserGeneratedInput',
);

// ts-unused-exports:disable-next-line
export type UserGeneratedInput = t.TypeOf<ReturnType<typeof userGeneratedInputCodec>>;

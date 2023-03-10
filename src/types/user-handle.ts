import * as t from 'io-ts';

type UserHandleBrand = {
  readonly UserHandle: unique symbol,
};

export const userHandleCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, UserHandleBrand> => input.match('^[a-zA-Z0-9_]{4,15}$') !== null,
  'UserHandle',
);

export type UserHandle = t.TypeOf<typeof userHandleCodec>;

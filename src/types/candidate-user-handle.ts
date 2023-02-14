import * as t from 'io-ts';

type CandidateUserHandleBrand = {
  readonly CandidateUserHandle: unique symbol,
};

export const candidateUserHandleCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, CandidateUserHandleBrand> => input.match('^[a-zA-Z0-9_]{4,15}$') !== null,
  'CandidateUserHandle',
);

export type CandidateUserHandle = t.TypeOf<typeof candidateUserHandleCodec>;

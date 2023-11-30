import * as t from 'io-ts';

type PaperIdBrand = {
  readonly PaperId: unique symbol,
};

const paperIdCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, PaperIdBrand> => input.length > 0,
  'PaperId',
);

export type PaperId = t.TypeOf<typeof paperIdCodec>;

import * as t from 'io-ts';

export const slugRegex = '[A-Za-z0-9-]{0,255}';

type SlugBrand = {
  readonly Slug: unique symbol,
};

export const slugCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, SlugBrand> => true,
  'Slug',
);

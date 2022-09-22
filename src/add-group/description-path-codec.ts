import * as t from 'io-ts';

type DescriptionPathBrand = {
  readonly DescriptionPath: unique symbol,
};

export const descriptionPathCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, DescriptionPathBrand> => !input.includes('/'),
  'DescriptionPath',
);

import * as t from 'io-ts';

type DescriptionPathBrand = {
  readonly DescriptionPath: unique symbol,
};

export const descriptionPathCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, DescriptionPathBrand> => !input.includes('/') && input.endsWith('.md'),
  'DescriptionPath',
);

export type DescriptionPath = t.TypeOf<typeof descriptionPathCodec>;

// ts-unused-exports:disable-next-line
export const fromValidatedString = (input: string): DescriptionPath => input as DescriptionPath;

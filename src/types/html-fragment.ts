import * as t from 'io-ts';

export const toHtmlFragment = (value: string): HtmlFragment => value as HtmlFragment;

type HtmlFragmentBrand = {
  readonly HtmlFragment: unique symbol,
};

export const htmlFragmentCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, HtmlFragmentBrand> => true,
  'HtmlFragment',
);

export type HtmlFragment = t.TypeOf<typeof htmlFragmentCodec>;

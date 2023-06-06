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

export const html = (
  literals: TemplateStringsArray,
  ...substitutions: ReadonlyArray<string | number>
): HtmlFragment => {
  let result = '';
  // eslint-disable-next-line no-loops/no-loops, no-plusplus
  for (let index = 0; index < substitutions.length; index++) {
    result += literals[index];
    result += substitutions[index];
  }
  result += literals[substitutions.length + 1];
  return result as HtmlFragment;
};

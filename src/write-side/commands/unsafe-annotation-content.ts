import * as t from 'io-ts';

type UnsafeAnnotationContentBrand = {
  readonly UnsafeAnnotationContent: unique symbol,
};

export const unsafeAnnotationContentCodec = t.brand(
  t.string,
  (input): input is t.Branded<string, UnsafeAnnotationContentBrand> => input.length > 0
  && input.length <= 4000,
  'UnsafeAnnotationContent',
);

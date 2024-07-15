import * as t from 'io-ts';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../types/unsafe-user-input';

type UnsafeAnnotationContentBrand = {
  readonly UnsafeAnnotationContent: unique symbol,
};

export const unsafeAnnotationContentCodec = t.brand(
  unsafeUserInputCodec,
  (input): input is t.Branded<UnsafeUserInput, UnsafeAnnotationContentBrand> => input.length > 0
  && input.length <= 4000,
  'UnsafeAnnotationContent',
);

export type UnsafeAnnotationContent = t.TypeOf<typeof unsafeAnnotationContentCodec>;

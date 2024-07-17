import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { UnsafeAnnotationContent, unsafeAnnotationContentCodec } from '../../../src/write-side/commands/unsafe-annotation-content';
import { arbitraryWord } from '../../helpers';

// ts-unused-exports:disable-next-line
export const arbitraryUnsafeAnnotationContent = (length = 12): UnsafeAnnotationContent => pipe(
  arbitraryWord(length),
  unsafeAnnotationContentCodec.decode,
  E.getOrElseW((errors) => { throw new Error(formatValidationErrors(errors).join('')); }),
);

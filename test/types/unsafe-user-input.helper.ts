import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryWord } from '../helpers';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../src/types/unsafe-user-input';

// ts-unused-exports:disable-next-line
export const arbitraryUnsafeUserInput = (): UnsafeUserInput => pipe(
  arbitraryWord(12),
  unsafeUserInputCodec.decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

// ts-unused-exports:disable-next-line
export const arbitraryLongUnsafeUserInput = (
  length: number,
): UnsafeUserInput => arbitraryWord(length) as UnsafeUserInput;

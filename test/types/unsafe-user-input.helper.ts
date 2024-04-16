import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../src/types/unsafe-user-input';
import { arbitraryWord } from '../helpers';

export const arbitraryUnsafeUserInput = (): UnsafeUserInput => pipe(
  arbitraryWord(12),
  unsafeUserInputCodec.decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

export const arbitraryLongUnsafeUserInput = (
  length: number,
): UnsafeUserInput => arbitraryWord(length) as UnsafeUserInput;

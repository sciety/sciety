import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { SanitisedUserInput, sanitisedUserInputCodec } from '../../src/types/sanitised-user-input';
import { arbitraryWord } from '../helpers';

export const arbitrarySanitisedUserInput = (): SanitisedUserInput => pipe(
  arbitraryWord(12),
  sanitisedUserInputCodec({ maxInputLength: 12 }).decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

// ts-unused-exports:disable-next-line
export const arbitraryLongSanitisedUserInput = (
  length: number,
): SanitisedUserInput => arbitraryWord(length) as SanitisedUserInput;

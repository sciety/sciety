import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { UserGeneratedInput, userGeneratedInputCodec } from '../../src/types/user-generated-input';
import { arbitraryWord } from '../helpers';

export const arbitraryUserGeneratedInput = (): UserGeneratedInput => pipe(
  arbitraryWord(12),
  userGeneratedInputCodec({ maxInputLength: 12 }).decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { arbitraryWord } from '../helpers';
import { CandidateUserHandle, candidateUserHandleCodec } from '../../src/types/candidate-user-handle';

export const arbitraryCandidateUserHandle = (): CandidateUserHandle => pipe(
  arbitraryWord(10),
  candidateUserHandleCodec.decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

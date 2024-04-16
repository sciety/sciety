import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { CandidateUserHandle, candidateUserHandleCodec } from '../../src/types/candidate-user-handle';
import { arbitraryWord } from '../helpers';

export const arbitraryCandidateUserHandle = (): CandidateUserHandle => pipe(
  arbitraryWord(10),
  candidateUserHandleCodec.decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

export const candidateUserHandleFromString = (input: string): CandidateUserHandle => input as CandidateUserHandle;

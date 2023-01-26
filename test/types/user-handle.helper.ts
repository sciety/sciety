import * as PR from 'io-ts/PathReporter';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as UH from '../../src/types/user-handle';
import { arbitraryWord } from '../helpers';

export const arbitraryUserHandle = (): UH.UserHandle => pipe(
  arbitraryWord(10),
  UH.userHandleCodec.decode,
  E.getOrElseW((errors) => { throw new Error(PR.failure(errors).join('')); }),
);

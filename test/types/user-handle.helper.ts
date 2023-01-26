import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as UH from '../../src/types/user-handle';
import { arbitraryWord } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

export const arbitraryUserHandle = (): UH.UserHandle => pipe(
  arbitraryWord(),
  UH.userHandleCodec.decode,
  E.getOrElseW(shouldNotBeCalled),
);

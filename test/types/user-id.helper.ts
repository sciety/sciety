import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { shouldNotBeCalled } from '../should-not-be-called';
import { UserId, userIdCodec } from '../../src/types/user-id';
import { arbitraryWord } from '../helpers';

export const arbitraryUserId = (): UserId => pipe(
  arbitraryWord(),
  userIdCodec.decode,
  E.getOrElseW(shouldNotBeCalled),
);

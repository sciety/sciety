import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { shouldNotBeCalled } from '../should-not-be-called.js';
import { UserId, userIdCodec } from '../../src/types/user-id.js';
import { arbitraryNumber, arbitraryWord } from '../helpers.js';

const prefixes = ['auth0|', 'twitter|', ''];

const generatePrefix = () => prefixes[arbitraryNumber(0, prefixes.length - 1)];

export const arbitraryUserId = (prefix = generatePrefix()): UserId => pipe(
  `${prefix}${arbitraryWord()}`,
  userIdCodec.decode,
  E.getOrElseW(shouldNotBeCalled),
);

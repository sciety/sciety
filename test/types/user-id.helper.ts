import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { UserId, userIdCodec } from '../../src/types/user-id';
import { abortTest } from '../framework/abort-test';
import { arbitraryNumber, arbitraryWord } from '../helpers';

const prefixes = ['auth0|', 'twitter|', ''];

const generatePrefix = () => prefixes[arbitraryNumber(0, prefixes.length - 1)];

export const arbitraryUserId = (prefix = generatePrefix()): UserId => pipe(
  `${prefix}${arbitraryWord()}`,
  userIdCodec.decode,
  E.getOrElseW(abortTest('arbitraryUserId generated invalid user id')),
);

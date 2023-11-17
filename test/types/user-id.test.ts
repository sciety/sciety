import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { userIdCodec } from '../../src/types/user-id.js';
import { shouldNotBeCalled } from '../should-not-be-called.js';

describe('user-id', () => {
  it.each([
    ['auth0|63d8f06993ff1642c77e0e91', 'auth0|63d8f06993ff1642c77e0e91'],
    ['twitter|1295307136415735808', 'twitter|1295307136415735808'],
    ['1295307136415735808', 'twitter|1295307136415735808'],
  ])('encodes %s to a canonical value', (input, expectedValue) => {
    expect(pipe(
      input,
      userIdCodec.decode,
      E.map(userIdCodec.encode),
      E.getOrElseW(shouldNotBeCalled),
    )).toBe(expectedValue);
  });

  it.each([
    43,
    null,
    undefined,
    '',
    'unsupportedconnection|63d8f06993ff1642c77e0e91',
    'unsupportedconnection|',
    '|',
    'auth0|twitter|63d8f06993ff1642c77e0e91',
    'xauth0|63d8f06993ff1642c77e0e91',
  ])('cannot decode %s as a UserId', (input) => {
    expect(pipe(
      input,
      userIdCodec.decode,
      E.isLeft,
    )).toBe(true);
  });
});

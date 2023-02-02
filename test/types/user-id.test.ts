import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { userIdCodec } from '../../src/types/user-id';

describe('user-id', () => {
  it.each([
    43,
    null,
    undefined,
    '',
  ])('cannot decode an invalid UserId', (input) => {
    expect(pipe(
      input,
      userIdCodec.decode,
      E.isLeft,
    )).toBe(true);
  });
});

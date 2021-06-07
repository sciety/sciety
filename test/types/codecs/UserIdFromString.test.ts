import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { UserIdFromString } from '../../../src/types/codecs/UserIdFromString';
import { arbitraryUserId } from '../user-id.helper';

describe('codec UserIdFromString', () => {
  it('encodes and decodes back to the same value', () => {
    const id = arbitraryUserId();

    expect(pipe(
      id,
      UserIdFromString.encode,
      UserIdFromString.decode,
    )).toStrictEqual(E.right(id));
  });

  it.each([
    43,
    null,
    undefined,
    '',
  ])('cannot decode an invalid UserId', (input) => {
    expect(pipe(
      input,
      UserIdFromString.decode,
      E.isLeft,
    )).toBe(true);
  });
});

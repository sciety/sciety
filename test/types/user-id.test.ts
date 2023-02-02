import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { userIdCodec } from '../../src/types/user-id';
import { arbitraryUserId } from './user-id.helper';

describe('user-id', () => {
  it('encodes and decodes back to the same value', () => {
    const id = arbitraryUserId();

    expect(pipe(
      id,
      userIdCodec.encode,
      userIdCodec.decode,
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
      userIdCodec.decode,
      E.isLeft,
    )).toBe(true);
  });
});

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
});

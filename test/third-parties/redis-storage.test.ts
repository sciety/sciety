import { StorageValue } from 'axios-cache-interceptor';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { decode, encode } from '../../src/third-parties/cache/redis-storage';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('redis-storage', () => {
  describe('when successfully decoding a storage value', () => {
    const value = '{}';
    let decoded: StorageValue;

    beforeEach(() => {
      decoded = pipe(
        value,
        decode,
        E.getOrElseW(shouldNotBeCalled),
      );
    });

    it('encodes to the original value', () => {
      expect(encode(decoded)).toStrictEqual(value);
    });
  });

  describe('when decode', () => {
    describe('is passed invalid JSON', () => {
      const value = 'foo';
      let result: E.Either<unknown, StorageValue>;

      beforeEach(() => {
        result = decode(value);
      });

      it('returns on the left', () => {
        expect(E.isLeft(result)).toBe(true);
      });
    });
  });
});

import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { StorageValue } from 'axios-cache-interceptor';
import { shouldNotBeCalled } from '../should-not-be-called';
import { decode, encode } from '../../src/third-parties/redis-storage';

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

  describe('when failing to decode a storage value', () => {
    it.todo('returns on the left');
  });
});

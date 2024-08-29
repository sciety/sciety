import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { urlCodec } from '../../src/types/url';
import { arbitraryDate, arbitraryString, arbitraryUrl } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('urlCodec', () => {
  describe('given an URL object', () => {
    const input = arbitraryUrl();

    it('encodes to a string', () => {
      expect(pipe(
        input,
        urlCodec.encode,
      )).toBe(input.href);
    });
  });

  describe('given a string containing a valid url', () => {
    const input = 'https://example.com';

    it('decodes to an URL object', () => {
      expect(pipe(
        input,
        urlCodec.decode,
        E.getOrElseW(shouldNotBeCalled),
      )).toStrictEqual(new URL(input));
    });

    it.failing('encodes back to the same value', () => {
      expect(pipe(
        input,
        urlCodec.decode,
        E.map(urlCodec.encode),
        E.getOrElseW(shouldNotBeCalled),
      )).toStrictEqual(input);
    });
  });

  describe('given a string containing an invalid url', () => {
    const result = urlCodec.decode(arbitraryString());

    it('fails to decode', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });

  describe('given a non-string value', () => {
    const result = urlCodec.decode(arbitraryDate());

    it('fails to decode', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});

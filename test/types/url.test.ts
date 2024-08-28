import { pipe } from 'fp-ts/function';
import { urlCodec } from '../../src/types/url';
import { arbitraryUrl } from '../helpers';

describe('urlCodec', () => {
  describe('given an URL object', () => {
    const input = arbitraryUrl();

    it.failing('encodes to a string', () => {
      expect(pipe(
        input,
        urlCodec.encode,
      )).toBe(input.href);
    });
  });

  describe('given a string containing a valid url', () => {
    it.todo('decodes to an URL object');
  });

  describe('given a string containing an invalid url', () => {
    it.todo('fails to decode');
  });
});

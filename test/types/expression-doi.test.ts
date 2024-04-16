import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { arbitraryExpressionDoi } from './expression-doi.helper';
import { canonicalExpressionDoiCodec, expressionDoiCodec, hasPrefix } from '../../src/types/expression-doi';
import { arbitraryString } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('expression-doi', () => {
  describe.each([
    ['10.1111/123456'],
  ])('when successfully decoding a DOI (%s)', (input) => {
    const decoded = pipe(
      input,
      expressionDoiCodec.decode,
      E.getOrElseW(shouldNotBeCalled),
    );

    describe('encoding', () => {
      it('returns the original value', () => {
        expect(expressionDoiCodec.encode(decoded)).toBe(input);
      });
    });
  });

  describe('given a value prefixed with `doi:`', () => {
    const expressionDoi = arbitraryExpressionDoi();

    it('decodes the value successfully', () => {
      expect(expressionDoiCodec.decode(`doi:${expressionDoi}`)).toStrictEqual(E.right(expressionDoi));
      expect(canonicalExpressionDoiCodec.decode(`doi:${expressionDoi}`)).toStrictEqual(E.right(expressionDoi));
    });
  });

  describe('when decoding a value that is not a doi', () => {
    const decoded = expressionDoiCodec.decode(arbitraryString());

    it('returns on the left', () => {
      expect(E.isLeft(decoded)).toBe(true);
    });
  });

  describe('when the input contains uppercase letters', () => {
    const input = '10.1234/AbCd';
    const decoded = pipe(
      input,
      canonicalExpressionDoiCodec.decode,
      E.getOrElseW(shouldNotBeCalled),
    );

    it('decodes to a canonical (lowercase) value', () => {
      expect(decoded).toBe('10.1234/abcd');
    });
  });

  describe('hasPrefix', () => {
    const input = '10.5281/zenodo.3678326';
    const expressionDoi = pipe(
      input,
      canonicalExpressionDoiCodec.decode,
      E.getOrElseW(shouldNotBeCalled),
    );

    it('returns true if the prefix matches', () => {
      expect(hasPrefix('10.5281')(expressionDoi)).toBe(true);
    });

    it('returns false if the prefix does not match', () => {
      expect(hasPrefix('10.5282')(expressionDoi)).toBe(false);
    });
  });
});

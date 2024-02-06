import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryString } from '../helpers';
import { expressionDoiCodec } from '../../src/types/expression-doi';

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

  describe('when decoding a value that is not a doi', () => {
    const decoded = expressionDoiCodec.decode(arbitraryString());

    it('returns on the left', () => {
      expect(E.isLeft(decoded)).toBe(true);
    });
  });
});

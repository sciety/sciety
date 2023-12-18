import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { PaperId } from '../../src/third-parties';
import { arbitraryArticleId } from '../types/article-id.helper';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryString } from '../helpers';

describe('paper-id', () => {
  describe.each([
    [arbitraryArticleId().value],
  ])('when successfully decoding a DOI (%s)', (input) => {
    const decoded = pipe(
      input,
      PaperId.paperIdCodec.decode,
      E.getOrElseW(shouldNotBeCalled),
    );

    it('isDoi detects that the paper id is a doi', () => {
      expect(PaperId.isDoi(decoded)).toBe(true);
    });

    describe('encoding', () => {
      it.failing('returns the original value', () => {
        expect(PaperId.paperIdCodec.encode(decoded)).toBe(input);
      });
    });

    describe('getDoiPortion', () => {
      const result = pipe(
        decoded,
        O.fromPredicate(PaperId.isDoi),
        O.getOrElseW(shouldNotBeCalled),
        PaperId.getDoiPortion,
      );

      it('results in the original value', () => {
        expect(result).toBe(input);
      });
    });
  });

  describe('when decoding a value that is not a doi', () => {
    const decoded = PaperId.paperIdCodec.decode(arbitraryString());

    it('returns on the left', () => {
      expect(E.isLeft(decoded)).toBe(true);
    });
  });
});

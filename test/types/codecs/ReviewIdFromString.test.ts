import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { ReviewIdFromString } from '../../../src/types/codecs/ReviewIdFromString';
import { arbitraryHypothesisAnnotationId } from '../hypothesis-annotation-id.helper';

describe('codec ReviewIdFromString', () => {
  describe('given a hypothesis id', () => {
    it('encodes and decodes back to the same value', () => {
      const id = arbitraryHypothesisAnnotationId();

      expect(pipe(
        id,
        ReviewIdFromString.encode,
        ReviewIdFromString.decode,
      )).toStrictEqual(E.right(id));
    });
  });
});

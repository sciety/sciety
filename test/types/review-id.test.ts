import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryDoi } from './doi.helper';
import { arbitraryHypothesisAnnotationId } from './hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from './ncrc-id.helper';
import * as RI from '../../src/types/review-id';

describe('review-id', () => {
  describe('when is a DOI', () => {
    it('can be serialized and deserialized', () => {
      const reviewId = arbitraryDoi();

      expect(pipe(
        reviewId,
        RI.toString,
        RI.deserialize,
      )).toStrictEqual(O.some(reviewId));
    });
  });

  describe('when is a Hypothesis annotation id', () => {
    it('can be serialized and deserialized', () => {
      const reviewId = arbitraryHypothesisAnnotationId();

      expect(pipe(
        reviewId,
        RI.toString,
        RI.deserialize,
      )).toStrictEqual(O.some(reviewId));
    });
  });

  describe('when is an NCRC id', () => {
    it('can be serialized and deserialized', () => {
      const reviewId = arbitraryNcrcId();

      expect(pipe(
        reviewId,
        RI.toString,
        RI.deserialize,
      )).toStrictEqual(O.some(reviewId));
    });
  });

  describe('when is not of a recognised format', () => {
    it('returns a none', () => {
      const unrecognisedFormat = 'foo';

      expect(RI.deserialize(unrecognisedFormat)).toStrictEqual(O.none);
    });
  });
});

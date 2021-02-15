import { Doi } from '../../src/types/doi';
import { HypothesisAnnotationId } from '../../src/types/hypothesis-annotation-id';
import * as NcrcId from '../../src/types/ncrc-id';
import { ReviewId, toReviewId, toString } from '../../src/types/review-id';

describe('review-id', () => {
  describe('when is a DOI', () => {
    it('can be serialized and deserialized', () => {
      const doiValue = '10.1111/12345678';
      const reviewId: ReviewId = new Doi(doiValue);
      const serialization = toString(reviewId);
      const deserialized = toReviewId(serialization);

      expect(deserialized).toStrictEqual(reviewId);
    });
  });

  describe('when is a Hypothesis annotation id', () => {
    it('can be serialized and deserialized', () => {
      const hypothesisValue = 'GFEW8JXMEeqJQcuc-6NFhQ';
      const reviewId: ReviewId = new HypothesisAnnotationId(hypothesisValue);
      const serialization = toString(reviewId);
      const deserialized = toReviewId(serialization);

      expect(deserialized).toStrictEqual(reviewId);
    });
  });

  describe('when is an NCRC id', () => {
    it('can be serialized and deserialized', () => {
      const ncrcValue = 'fc00c499-879f-4db5-9e4e-2b38438776d9';
      const reviewId = NcrcId.fromString(ncrcValue);
      const serialization = toString(reviewId);
      const deserialized = toReviewId(serialization);

      expect(deserialized).toStrictEqual(reviewId);
    });
  });

  describe('when is not of a recognised format', () => {
    it('throws', () => {
      const unrecognisedFormat = 'foo';

      expect(() => toReviewId(unrecognisedFormat)).toThrow(`Unable to unserialize ReviewId: "${unrecognisedFormat}"`);
    });
  });
});

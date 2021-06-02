import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { arbitraryDoi } from './doi.helper';
import { arbitraryHypothesisAnnotationId } from './hypothesis-annotation-id.helper';
import { arbitraryNcrcId } from './ncrc-id.helper';
import * as RI from '../../src/types/review-id';

describe('review-id', () => {
  describe('when is a DOI', () => {
    const reviewId = arbitraryDoi();

    it('can be serialized and deserialized', () => {
      expect(pipe(
        reviewId,
        RI.serialize,
        RI.deserialize,
      )).toStrictEqual(O.some(reviewId));
    });

    it('identifies the service as doi', () => {
      expect(pipe(
        reviewId,
        RI.service,
      )).toStrictEqual('doi');
    });
  });

  describe('when is a Hypothesis annotation id', () => {
    const reviewId = arbitraryHypothesisAnnotationId();

    it('can be serialized and deserialized', () => {
      expect(pipe(
        reviewId,
        RI.serialize,
        RI.deserialize,
      )).toStrictEqual(O.some(reviewId));
    });

    it('identifies the service as hypothesis', () => {
      expect(pipe(
        reviewId,
        RI.service,
      )).toStrictEqual('hypothesis');
    });
  });

  describe('when is an NCRC id', () => {
    const reviewId = arbitraryNcrcId();

    it('can be serialized and deserialized', () => {
      expect(pipe(
        reviewId,
        RI.serialize,
        RI.deserialize,
      )).toStrictEqual(O.some(reviewId));
    });

    it('identifies the service as ncrc', () => {
      expect(pipe(
        reviewId,
        RI.service,
      )).toStrictEqual('ncrc');
    });
  });

  describe('when is not of a recognised format', () => {
    it('cannot be deserialized', () => {
      const unrecognisedFormat = 'foo';

      expect(RI.deserialize(unrecognisedFormat)).toStrictEqual(O.none);
    });
  });
});

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as DOI from '../../src/types/doi';
import { HypothesisAnnotationId } from '../../src/types/hypothesis-annotation-id';
import * as NcrcId from '../../src/types/ncrc-id';
import * as RI from '../../src/types/review-id';
import { arbitraryWord } from '../helpers';

describe('review-id', () => {
  describe('when is a DOI', () => {
    const key = `10.1101/${arbitraryWord()}`;
    const reviewId = DOI.fromString(key);

    it('can be serialized and deserialized', () => {
      expect(pipe(
        reviewId,
        O.map(RI.serialize),
        O.map(RI.deserialize),
      )).toStrictEqual(O.some(reviewId));
    });

    it('identifies the service as doi', () => {
      expect(pipe(
        reviewId,
        O.map(RI.service),
      )).toStrictEqual(O.some('doi'));
    });

    it('allows the key to be extracted', () => {
      expect(pipe(
        reviewId,
        O.map(RI.key),
      )).toStrictEqual(O.some(key));
    });
  });

  describe('when is a Hypothesis annotation id', () => {
    const key = arbitraryWord(12);
    const reviewId = new HypothesisAnnotationId(key);

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

    it('allows the key to be extracted', () => {
      expect(pipe(
        reviewId,
        RI.key,
      )).toStrictEqual(key);
    });
  });

  describe('when is an NCRC id', () => {
    const key = arbitraryWord(16);
    const reviewId = NcrcId.fromString(key);

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

    it('allows the key to be extracted', () => {
      expect(pipe(
        reviewId,
        RI.key,
      )).toStrictEqual(key);
    });
  });

  describe('when is not of a recognised format', () => {
    it('cannot be deserialized', () => {
      const unrecognisedFormat = 'foo';

      expect(RI.deserialize(unrecognisedFormat)).toStrictEqual(O.none);
    });
  });
});

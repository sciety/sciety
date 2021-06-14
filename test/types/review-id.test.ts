import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ReviewIdFromString as RIcodec } from '../../src/types/codecs/ReviewIdFromString';
import * as RI from '../../src/types/review-id';
import { arbitraryUri, arbitraryWord } from '../helpers';

describe('review-id', () => {
  describe('when is a DOI', () => {
    const key = arbitraryWord(12);
    const ingestedReviewId = `doi:${key}`;

    it('identifies the service as doi', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.service),
      )).toStrictEqual(E.right('doi'));
    });

    it('allows the key to be extracted', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.key),
      )).toStrictEqual(E.right(key));
    });
  });

  describe('when is a Hypothesis annotation id', () => {
    const key = arbitraryWord(12);
    const ingestedReviewId = `hypothesis:${key}`;

    it('identifies the service as hypothesis', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.service),
      )).toStrictEqual(E.right('hypothesis'));
    });

    it('allows the key to be extracted', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.key),
      )).toStrictEqual(E.right(key));
    });
  });

  describe('when is an NCRC id', () => {
    const key = arbitraryWord(16);
    const ingestedReviewId = `ncrc:${key}`;

    it('identifies the service as ncrc', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.service),
      )).toStrictEqual(E.right('ncrc'));
    });

    it('allows the key to be extracted', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.key),
      )).toStrictEqual(E.right(key));
    });
  });

  describe('when is a rapidreviews doi', () => {
    const key = arbitraryUri();
    const ingestedReviewId = `rapidreviews:${key.toString()}`;

    it('identifies the service as rapidreviews', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.service),
      )).toStrictEqual(E.right('rapidreviews'));
    });

    it('allows the key to be extracted', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.key),
      )).toStrictEqual(E.right(key));
    });

    it('infers the original URL', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        O.fromEither,
        O.chain(RI.inferredUrl),
        O.map((url) => url.toString()),
      )).toStrictEqual(O.some(key));
    });

    it('encodes to the original string', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RIcodec.encode),
      )).toStrictEqual(E.right(ingestedReviewId));
    });
  });

  describe('when is a preLights guid', () => {
    const key = arbitraryUri();
    const ingestedReviewId = `prelights:${key.toString()}`;

    it('identifies the service as prelights', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.service),
      )).toStrictEqual(E.right('prelights'));
    });

    it('allows the key to be extracted', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RI.key),
      )).toStrictEqual(E.right(key));
    });

    it('infers the original URL', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        O.fromEither,
        O.chain(RI.inferredUrl),
        O.map((url) => url.toString()),
      )).toStrictEqual(O.some(key));
    });

    it('encodes to the original string', () => {
      expect(pipe(
        ingestedReviewId,
        RIcodec.decode,
        E.map(RIcodec.encode),
      )).toStrictEqual(E.right(ingestedReviewId));
    });
  });

  describe('when is not of a recognised format', () => {
    it('cannot be deserialized', () => {
      const unrecognisedFormat = 'foo';

      expect(RIcodec.decode(unrecognisedFormat)._tag).toStrictEqual('Left');
    });
  });
});

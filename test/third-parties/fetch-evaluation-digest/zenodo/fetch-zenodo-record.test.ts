import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchZenodoRecord } from '../../../../src/third-parties/fetch-evaluation-digest/zenodo/fetch-zenodo-record';
import * as DE from '../../../../src/types/data-error';
import { dummyLogger } from '../../../dummy-logger';
import { arbitraryHtmlFragment } from '../../../helpers';
import { shouldNotBeCalled } from '../../../should-not-be-called';

const notZenodoKey = '10.1234/zenodo/123';
const zenodoKey = '10.5281/zenodo.6386692';
const unexpectedSuffixZenodoKeyMostComplex = '10.5281/somethingelse.123';

describe('fetch-zenodo-record', () => {
  describe('when the DOI is from Zenodo', () => {
    describe('and the DOI suffix has an unexpected format', () => {
      const queryExternalService = () => shouldNotBeCalled;
      let result: E.Either<unknown, unknown>;

      beforeEach(async () => {
        result = await fetchZenodoRecord(queryExternalService, dummyLogger)(unexpectedSuffixZenodoKeyMostComplex)();
      });

      it('returns a left', () => {
        expect(result).toStrictEqual(E.left(DE.unavailable));
      });
    });

    describe('when the request succeeds', () => {
      const description = arbitraryHtmlFragment();
      const queryExternalService = () => () => TE.right({
        metadata: {
          description,
        },
      });

      it('returns the metadata description as full text', async () => {
        const result = await fetchZenodoRecord(queryExternalService, dummyLogger)(zenodoKey)();

        expect(result).toStrictEqual(E.right(description));
      });
    });

    describe('when the request fails', () => {
      const queryExternalService = () => () => TE.left(DE.unavailable);
      let result: E.Either<unknown, unknown>;

      beforeEach(async () => {
        result = await fetchZenodoRecord(queryExternalService, dummyLogger)(zenodoKey)();
      });

      it('returns a left', () => {
        expect(result).toStrictEqual(E.left(DE.unavailable));
      });
    });

    describe('when the returned JSON value is unexpected', () => {
      const wrongProperty = arbitraryHtmlFragment();
      const queryExternalService = () => () => TE.right({
        metadata: {
          wrongProperty,
        },
      });
      let result: E.Either<unknown, unknown>;

      beforeEach(async () => {
        result = await fetchZenodoRecord(queryExternalService, dummyLogger)(zenodoKey)();
      });

      it('returns a left', () => {
        expect(result).toStrictEqual(E.left(DE.unavailable));
      });
    });
  });

  describe('when the DOI is not from Zenodo', () => {
    let result: E.Either<unknown, unknown>;
    const queryExternalService = shouldNotBeCalled;

    beforeEach(async () => {
      result = await fetchZenodoRecord(queryExternalService, dummyLogger)(notZenodoKey)();
    });

    it('returns a left', () => {
      expect(result).toStrictEqual(E.left(DE.unavailable));
    });
  });
});

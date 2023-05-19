import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { fetchZenodoRecord } from '../../../src/third-parties/zenodo/fetch-zenodo-record';
import * as DE from '../../../src/types/data-error';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryHtmlFragment } from '../../helpers';

const notZenodoKey = '10.1234/zenodo/123';
const zenodoKey = '10.5281/zenodo.6386692';
const unexpectedSuffixZenodoKeyMostComplex = '10.5281/somethingelse.123';
const doiUrl = 'https://doi.org/10.5281/zenodo.6386692';
const zenodoApiUrl = 'https://zenodo.org/api/records/6386692';

describe('fetch-zenodo-record', () => {
  describe('when the DOI is from Zenodo', () => {
    describe('and the DOI suffix has an unexpected format', () => {
      let getJson: (uri: string) => Promise<Json>;
      let evaluation: E.Either<unknown, unknown>;

      beforeEach(async () => {
        getJson = jest.fn();
        evaluation = await fetchZenodoRecord(getJson, dummyLogger)(unexpectedSuffixZenodoKeyMostComplex)();
      });

      it('returns a left', () => {
        expect(evaluation).toStrictEqual(E.left(DE.unavailable));
      });

      it('does not make unnecessary external api calls', () => {
        expect(getJson).not.toHaveBeenCalled();
      });
    });

    describe('on all requests', () => {
      let getJson: (uri: string) => Promise<Json>;

      beforeEach(async () => {
        getJson = jest.fn();
        await fetchZenodoRecord(getJson, dummyLogger)(zenodoKey)();
      });

      it('calls Zenodo API url', () => {
        expect(getJson).toHaveBeenCalledTimes(1);
        expect(getJson).toHaveBeenCalledWith(zenodoApiUrl);
      });
    });

    describe('when the request succeeds', () => {
      const description = arbitraryHtmlFragment();
      const getJson = async (): Promise<Json> => ({
        metadata: {
          description,
        },
      });

      it('returns the metadata description as full text', async () => {
        const evaluation = await fetchZenodoRecord(getJson, dummyLogger)(zenodoKey)();

        expect(
          pipe(
            evaluation,
            E.map((ev) => ev.fullText),
          ),
        ).toStrictEqual(E.right(description));
      });

      it('returns the Doi.org url as url', async () => {
        const evaluation = await fetchZenodoRecord(getJson, dummyLogger)(zenodoKey)();

        expect(
          pipe(
            evaluation,
            E.map((ev) => ev.url),
          ),
        ).toStrictEqual(E.right(new URL(doiUrl)));
      });
    });

    describe('when the request fails', () => {
      const getJson = async (): Promise<Json> => { throw new Error('500 response'); };
      let evaluation: E.Either<unknown, unknown>;

      beforeEach(async () => {
        evaluation = await fetchZenodoRecord(getJson, dummyLogger)(zenodoKey)();
      });

      it('returns a left', () => {
        expect(evaluation).toStrictEqual(E.left(DE.unavailable));
      });
    });

    describe('when the returned JSON value is unexpected', () => {
      const wrongProperty = arbitraryHtmlFragment();
      const getJson = async (): Promise<Json> => ({
        metadata: {
          wrongProperty,
        },
      });
      let evaluation: E.Either<unknown, unknown>;

      beforeEach(async () => {
        evaluation = await fetchZenodoRecord(getJson, dummyLogger)(zenodoKey)();
      });

      it('returns a left', () => {
        expect(evaluation).toStrictEqual(E.left(DE.unavailable));
      });
    });
  });

  describe('when the DOI is not from Zenodo', () => {
    let evaluation: E.Either<unknown, unknown>;
    let getJson: (uri: string) => Promise<Json>;

    beforeEach(async () => {
      getJson = jest.fn();
      evaluation = await fetchZenodoRecord(getJson, dummyLogger)(notZenodoKey)();
    });

    it('returns a left', () => {
      expect(evaluation).toStrictEqual(E.left(DE.unavailable));
    });

    it('does not make unnecessary external api calls', () => {
      expect(getJson).not.toHaveBeenCalled();
    });
  });
});

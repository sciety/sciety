import { URL } from 'url';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { Evaluation } from '../../src/infrastructure/evaluation';
import { fetchZenodoRecord } from '../../src/infrastructure/fetch-zenodo-record';
import * as DE from '../../src/types/data-error';
import { dummyLogger } from '../dummy-logger';
import { arbitraryHtmlFragment } from '../helpers';

const key = '10.5281/zenodo.6386692';
const url = 'https://doi.org/10.5281/zenodo.6386692';

describe('fetch-zenodo-record', () => {
  describe('when the DOI is from Zenodo', () => {
    describe('when the request succeeds', () => {
      const description = arbitraryHtmlFragment();
      const getJson = async (): Promise<Json> => ({
        metadata: {
          description,
        },
      });
      let evaluation: E.Either<unknown, Evaluation>;

      beforeEach(async () => {
        evaluation = await fetchZenodoRecord(getJson, dummyLogger)(key)();
      });

      it('returns the metadata description as full text', () => {
        expect(
          pipe(
            evaluation,
            E.map((ev) => ev.fullText),
          ),
        ).toStrictEqual(E.right(description));
      });

      it('returns the Doi.org url as url', () => {
        expect(
          pipe(
            evaluation,
            E.map((ev) => ev.url),
          ),
        ).toStrictEqual(E.right(new URL(url)));
      });
    });

    describe('when the request fails', () => {
      const getJson = async (): Promise<Json> => { throw new Error('500 response'); };
      let evaluation: E.Either<unknown, Evaluation>;

      beforeEach(async () => {
        evaluation = await fetchZenodoRecord(getJson, dummyLogger)(key)();
      });

      it('returns a left', () => {
        expect(evaluation).toStrictEqual(E.left(DE.unavailable));
      });
    });
  });

  describe('when the DOI is not from Zenodo', () => {
    it.todo('returns a left');
  });
});

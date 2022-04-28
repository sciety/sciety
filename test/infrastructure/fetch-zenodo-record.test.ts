import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import { Evaluation } from '../../src/infrastructure/evaluation';
import { fetchZenodoRecord } from '../../src/infrastructure/fetch-zenodo-record';
import { dummyLogger } from '../dummy-logger';

const key = '10.5281/zenodo.6386692';

describe('fetch-zenodo-record', () => {
  describe('when the DOI is from Zenodo', () => {
    describe('when the request succeeds', () => {
      const getJson = async (): Promise<Json> => ({
        metadata: {
          description: '<p>Very good</p>',
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
        ).toStrictEqual(E.right('<p>Very good</p>'));
      });

      it.todo('returns the Doi.org url as url');
    });

    describe('when the request fails', () => {
      it.todo('returns a left');
    });
  });

  describe('when the DOI is not from Zenodo', () => {
    it.todo('returns a left');
  });
});

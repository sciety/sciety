import { URL } from 'url';
import * as T from 'fp-ts/Task';
import { Json } from 'io-ts-types';
import { Evaluation } from '../../src/infrastructure/evaluation';
import { toHtmlFragment } from '../../src/types/html-fragment';
import { dummyLogger } from '../dummy-logger';

type FetchZenodoRecord = (getJson: unknown, logger: unknown) => (key: string) => T.Task<Evaluation>;
const fetchZenodoRecord: FetchZenodoRecord = () => () => T.of({ fullText: toHtmlFragment(''), url: new URL('') });

const key = '10.5281/zenodo.6386692';

describe('fetch-zenodo-record', () => {
  describe('when the DOI is from Zenodo', () => {
    describe('when the request succeeds', () => {
      const getJson = async (): Promise<Json> => ({
        metadata: {
          description: '<p>Very good</p>',
        },
      });
      let evaluation: Evaluation;

      beforeEach(async () => {
        evaluation = await fetchZenodoRecord(getJson, dummyLogger)(key)();
      });

      it.skip('returns the metadata description as full text', () => {
        expect(evaluation.fullText).toBe('<p>Very good</p>');
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

import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchNcrcEvaluations } from '../../src/ingest/fetch-ncrc-evaluations';
import { arbitraryDate } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';

const arbitraryGoogleSheetsResponse = {
  config: {},
  data: {},
  headers: {},
  request: {
    responseURL: '',
  },
  status: 200,
  statusText: '',
};

describe('fetch-ncrc-evaluations', () => {
  describe('when there is a medrxiv evaluation', () => {
    it('returns an NCRC evaluation locator', async () => {
      expect(await pipe(
        {
          fetchData: shouldNotBeCalled,
          fetchGoogleSheet: () => TE.right({
            ...arbitraryGoogleSheetsResponse,
            data: {
              values: [
                ['123', 0, 0, 0, 0, 0, arbitraryDoi().value, 0, 0, 0, 0, 0, 0, 0, 'medrxiv', 0, 0, 0, arbitraryDate().toISOString()],
              ],
            },
          }),
        },
        fetchNcrcEvaluations(),
      )()).toStrictEqual(E.right(expect.objectContaining({
        evaluations: [
          expect.objectContaining({ evaluationLocator: 'ncrc:123' }),
        ],
      })));
    });
  });

  describe('when the row has data missing', () => {
    it('returns an NCRC evaluation locator', async () => {
      expect(await pipe(
        {
          fetchData: shouldNotBeCalled,
          fetchGoogleSheet: () => TE.right({
            ...arbitraryGoogleSheetsResponse,
            data: {
              values: [
                ['123', 0, 0, 0, 0, 0, arbitraryDoi().value],
              ],
            },
          }),
        },
        fetchNcrcEvaluations(),
      )()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: [
          expect.objectContaining({ item: 'row 0' }),
        ],
      })));
    });
  });

  describe('when there is a non-medrxiv or biorxiv evaluation', () => {
    it('returns an NCRC evaluation locator', async () => {
      expect(await pipe(
        {
          fetchData: shouldNotBeCalled,
          fetchGoogleSheet: () => TE.right({
            ...arbitraryGoogleSheetsResponse,
            data: {
              values: [
                ['123', 0, 0, 0, 0, 0, arbitraryDoi().value, 0, 0, 0, 0, 0, 0, 0, 'nature', 0, 0, 0, arbitraryDate().toISOString()],
              ],
            },
          }),
        },
        fetchNcrcEvaluations(),
      )()).toStrictEqual(E.right(expect.objectContaining({
        skippedItems: [
          expect.objectContaining({ item: '123' }),
        ],
      })));
    });
  });

  describe('when there is no data', () => {
    it('returns an error', async () => {
      expect(await pipe(
        {
          fetchData: shouldNotBeCalled,
          fetchGoogleSheet: () => TE.right({
            ...arbitraryGoogleSheetsResponse,
            data: {},
          }),
        },
        fetchNcrcEvaluations(),
      )()).toStrictEqual(E.left(expect.stringMatching(/.values not provided/)));
    });
  });
});

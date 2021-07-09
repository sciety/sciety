import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchNcrcEvaluations } from '../../src/ingest/fetch-ncrc-evaluations';
import { shouldNotBeCalled } from '../should-not-be-called';

describe('fetch-ncrc-evaluations', () => {
  describe('when there is an evaluation', () => {
    it('returns an NCRC evaluation locator', async () => {
      expect(await pipe(
        {
          fetchData: shouldNotBeCalled,
          fetchGoogleSheet: () => TE.right({
            config: {},
            data: {
              values: [
                ['123', 0, 0, 0, 0, 0, '10.1101/abc', 0, 0, 0, 0, 0, 0, 0, 'medrxiv', 0, 0, 0, '2021-07-08'],
              ],
            },
            headers: {},
            request: {
              responseURL: '',
            },
            status: 200,
            statusText: '',
          }),
        },
        fetchNcrcEvaluations(),
      )()).toStrictEqual(E.right([expect.objectContaining({
        evaluationLocator: 'ncrc:123',
      })]));
    });
  });

  describe('when there is no data', () => {
    it('returns an error', async () => {
      expect(await pipe(
        {
          fetchData: shouldNotBeCalled,
          fetchGoogleSheet: () => TE.right({
            config: {},
            data: {},
            headers: {},
            request: {
              responseURL: '',
            },
            status: 200,
            statusText: '',
          }),
        },
        fetchNcrcEvaluations(),
      )()).toStrictEqual(E.left(expect.stringMatching(/Values not provided/)));
    });
  });
});

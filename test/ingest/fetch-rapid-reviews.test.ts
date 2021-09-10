import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReviews } from '../../src/ingest/fetch-rapid-reviews';
import { shouldNotBeCalled } from '../should-not-be-called';

const ingest = (xml: Record<string, unknown>) => pipe(
  {
    fetchData: <D>() => TE.right(xml as unknown as D),
    fetchGoogleSheet: shouldNotBeCalled,
  },
  fetchRapidReviews(),
);

describe('fetch-rapid-reviews', () => {
  describe('when there are no evaluations', () => {
    it('returns no evaluations and no skipped items', async () => {
      const crossrefJsonResponse = {
        message: {
          'total-results': 547,
          items: [],
        },
      };

      expect(await ingest(crossrefJsonResponse)()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [],
      }));
    });
  });

  describe('when there is a valid evaluation', () => {
    it.todo('returns 1 evaluation and no skipped items');
  });

  describe('when there is an invalid evaluation', () => {
    it.todo('returns 0 evaluations and 1 skipped item');
  });
});

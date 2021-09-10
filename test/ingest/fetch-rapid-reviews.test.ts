import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchRapidReviews } from '../../src/ingest/fetch-rapid-reviews';
import { arbitraryDate, arbitraryUri } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';

const ingest = (items: ReadonlyArray<unknown>) => {
  const fetchData = jest.fn()
    .mockReturnValueOnce(TE.right({
      message: {
        'total-results': items.length,
      },
    }))
    .mockReturnValueOnce(TE.right({
      message: { items },
    }));
  return pipe(
    {
      fetchData,
      fetchGoogleSheet: shouldNotBeCalled,
    },
    fetchRapidReviews(),
  );
};

describe('fetch-rapid-reviews', () => {
  describe('when there are no evaluations', () => {
    it('returns no evaluations and no skipped items', async () => {
      expect(await ingest([])()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [],
      }));
    });
  });

  describe('when there is a valid evaluation', () => {
    it('returns 1 evaluation and no skipped items', async () => {
      const articleDoi = arbitraryDoi().value;
      const date = arbitraryDate();
      const reviewUrl = arbitraryUri();
      const items = [
        {
          URL: reviewUrl,
          created: { 'date-time': date.toString() },
          relation: { 'is-review-of': [{ id: articleDoi }] },
        },
      ];

      expect(await ingest(items)()).toStrictEqual(E.right({
        evaluations: [
          {
            articleDoi,
            date,
            evaluationLocator: `rapidreviews:${reviewUrl}`,
          },
        ],
        skippedItems: [],
      }));
    });
  });

  describe('when there is an invalid evaluation', () => {
    it('returns 0 evaluations and 1 skipped item', async () => {
      const articleDoi = '10.26434/chemrxiv.12770225.v1';
      const date = arbitraryDate();
      const reviewUrl = arbitraryUri();
      const items = [
        {
          URL: reviewUrl,
          created: { 'date-time': date.toString() },
          relation: { 'is-review-of': [{ id: articleDoi }] },
        },
      ];

      expect(await ingest(items)()).toStrictEqual(E.right({
        evaluations: [],
        skippedItems: [
          {
            item: articleDoi,
            reason: 'Not a biorxiv article',
          },
        ],
      }));
    });
  });
});

import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as CR from '../../../src/ingest/crossref';
import { arbitraryDate, arbitraryUri, arbitraryWord } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

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
    arbitraryWord(),
    CR.fetchAllReviewsBy(fetchData),
  );
};

describe('fetch-all-reviews-by', () => {
  describe('when there are no evaluations', () => {
    it('returns no reviews', async () => {
      expect(await ingest([])()).toStrictEqual(E.right([]));
    });
  });

  describe('when there is a review', () => {
    it('returns the review', async () => {
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

      expect(await ingest(items)()).toStrictEqual(E.right([
        {
          URL: reviewUrl,
          created: { 'date-time': date },
          relation: { 'is-review-of': [{ id: articleDoi }] },
        },
      ]));
    });
  });
});

import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as CR from '../../../../src/ingest/evaluation-discovery/crossref';
import { arbitraryDate, arbitraryUri, arbitraryWord } from '../../../helpers';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { stubbedFetchData } from '../fetch-data.helper';

const ingest = (items: ReadonlyArray<unknown>) => {
  const fetchData = stubbedFetchData({ message: { items } });
  return CR.fetchReviewsIndexedSince(fetchData)(arbitraryWord(), arbitraryDate());
};

describe('fetch-all-reviews-by', () => {
  describe('when there are no evaluations', () => {
    it('returns no reviews', async () => {
      expect(await ingest([])()).toStrictEqual(E.right([]));
    });
  });

  describe('when there is a review', () => {
    it('returns the review', async () => {
      const articleDoi = arbitraryExpressionDoi();
      const date = arbitraryDate();
      const reviewUrl = arbitraryUri();
      const givenName1 = arbitraryWord();
      const givenName2 = arbitraryWord();
      const familyName1 = arbitraryWord();
      const familyName2 = arbitraryWord();
      const primaryUrl = arbitraryUri();
      const items = [
        {
          URL: reviewUrl,
          created: { 'date-time': date.toString() },
          relation: { 'is-review-of': [{ id: articleDoi }] },
          author: [
            { given: givenName1, family: familyName1 },
            { given: givenName2, family: familyName2 },
          ],
          resource: {
            primary: {
              URL: primaryUrl,
            },
          },
        },
      ];

      expect(await ingest(items)()).toStrictEqual(E.right([
        {
          URL: reviewUrl,
          created: { 'date-time': date },
          relation: { 'is-review-of': [{ id: articleDoi }] },
          author: O.some([
            { given: O.some(givenName1), family: familyName1 },
            { given: O.some(givenName2), family: familyName2 },
          ]),
          resource: {
            primary: {
              URL: primaryUrl,
            },
          },
        },
      ]));
    });
  });
});

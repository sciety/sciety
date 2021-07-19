/* eslint-disable jest/expect-expect */
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import {
  GroupActivities,
  paginate,
} from '../../../src/group-evaluations-page/evaluated-articles-list/group-activities';
import { ArticleActivity } from '../../../src/types/article-activity';
import * as DE from '../../../src/types/data-error';

import { arbitraryDate, arbitraryNumber } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';

const expectContentOf = (activities: GroupActivities, expectedContent: unknown) => (
  expect(activities).toStrictEqual(E.right(expect.objectContaining({
    content: expectedContent,
  })))
);

describe('paginate', () => {
  const pageSize = arbitraryNumber(3, 10);

  const generateNArticles = (
    numberOfArticles: number,
  ): ReadonlyArray<ArticleActivity> => (
    [...Array(numberOfArticles).keys()].map(() => ({
      doi: arbitraryDoi(),
      latestActivityDate: arbitraryDate(),
      evaluationCount: arbitraryNumber(1, 5),
    })));

  describe('when the group has evaluated multiple articles', () => {
    it('limits the number of entries to the requested page size', () => {
      const articleActivities = generateNArticles(pageSize + 3);
      const activities = paginate(1, pageSize)(articleActivities);

      expect(pipe(
        activities,
        E.map((a) => a.content.length),
      )).toStrictEqual(E.right(pageSize));
    });

    it('returns the specified page of the list', () => {
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const articleActivities = [
        {
          doi: arbitraryDoi(),
          latestActivityDate: laterDate,
          evaluationCount: arbitraryNumber(1, 5),
        },
        {
          doi: arbitraryDoi(),
          latestActivityDate: earlierDate,
          evaluationCount: arbitraryNumber(1, 5),
        },
      ];
      const activities = paginate(2, 1)(articleActivities);

      expectContentOf(activities, [
        expect.objectContaining({
          latestActivityDate: earlierDate,
        }),
      ]);
    });

    it.each([
      [9, 1, O.none],
      [11, 1, O.some(2)],
      [20, 1, O.some(2)],
      [20, 2, O.none],
      [21, 2, O.some(3)],
      [21, 3, O.none],
    ])('given %d events and a request for page %d, returns the next page', (numberOfEvents, page, expected) => {
      const articles = generateNArticles(numberOfEvents);
      const activities = paginate(page, 10)(articles);

      expect(activities).toStrictEqual(E.right(expect.objectContaining({
        nextPageNumber: expected,
      })));
    });

    it('returns not-found when asked for a page that does not exist', () => {
      const articles = generateNArticles(1);
      const activities = paginate(2, 10)(articles);

      expect(activities).toStrictEqual(E.left(DE.notFound));
    });

    it('returns an empty page 1 when there are no events', () => {
      const activities = paginate(arbitraryNumber(1, 20), 10)([]);

      expectContentOf(activities, []);
    });
  });
});

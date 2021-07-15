/* eslint-disable jest/expect-expect */
import * as O from 'fp-ts/Option';
import { GroupActivities, groupActivities } from '../../../src/group-evaluations-page/recent-activity/group-activities';
import { Doi } from '../../../src/types/doi';
import {
  editorialCommunityReviewedArticle,
  EditorialCommunityReviewedArticleEvent,
} from '../../../src/types/domain-events';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryDate, arbitraryNumber } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

const generateNEventsForGroup = (
  numberOfEvents: number,
  groupId: GroupId,
): ReadonlyArray<EditorialCommunityReviewedArticleEvent> => (
  [...Array(numberOfEvents).keys()].map((i) => (editorialCommunityReviewedArticle(
    groupId,
    new Doi(`10.1101/${i}`),
    arbitraryReviewId(),
  ))));

const expectContentOf = (activities: GroupActivities, expectedContent: unknown) => (
  expect(activities.content).toStrictEqual(expectedContent)
);

describe('group-activities', () => {
  const pageSize = arbitraryNumber(3, 10);

  describe('when only a single group has evaluated an article once', () => {
    const articleId = arbitraryDoi();
    const groupId = arbitraryGroupId();
    const date = arbitraryDate();
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        arbitraryReviewId(),
        date,
      ),
    ];

    it('includes the article DOI', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of 1', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          evaluationCount: 1,
        }),
      ]);
    });

    it('latest activity date matches event date', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          latestActivityDate: date,
        }),
      ]);
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    const groupId = arbitraryGroupId();
    const articleId = arbitraryDoi();
    const latestActivityDate = new Date('2020-01-01');
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        arbitraryReviewId(),
        new Date('1980-01-01'),
      ),
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        arbitraryReviewId(),
        latestActivityDate,
      ),
    ];

    it('has a single entry for the article', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of the number of evaluations', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          evaluationCount: 2,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          latestActivityDate,
        }),
      ]);
    });
  });

  describe('when multiple groups have evaluated an article', () => {
    const groupId = arbitraryGroupId();
    const otherGroupId = arbitraryGroupId();
    const articleId = arbitraryDoi();
    const mostRecentActivityDate = new Date('2021-03-10T00:00:00.000Z');
    const events = [
      editorialCommunityReviewedArticle(
        groupId,
        articleId,
        arbitraryReviewId(),
        new Date('2020-10-14T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        mostRecentActivityDate,
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        mostRecentActivityDate,
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        mostRecentActivityDate,
      ),
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          doi: articleId,
          evaluationCount: 4,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation by any group', () => {
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          latestActivityDate: mostRecentActivityDate,
        }),
      ]);
    });
  });

  describe('when the group has evaluated multiple articles', () => {
    const groupId = arbitraryGroupId();

    it('returns the most recently evaluated articles first', () => {
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const events = [
        editorialCommunityReviewedArticle(
          groupId,
          arbitraryDoi(),
          arbitraryReviewId(),
          earlierDate,
        ),
        editorialCommunityReviewedArticle(
          groupId,
          arbitraryDoi(),
          arbitraryReviewId(),
          laterDate,
        ),
      ];
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          latestActivityDate: laterDate,
        }),
        expect.objectContaining({
          latestActivityDate: earlierDate,
        }),
      ]);
    });

    it('limits the number of entries to the requested page size', () => {
      const events = generateNEventsForGroup(pageSize + 3, groupId);
      const activities = groupActivities(groupId, 1, pageSize)(events);

      expect(activities.content).toHaveLength(pageSize);
    });

    it('returns the specified page of the list', () => {
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const events = [
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), earlierDate),
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId(), laterDate),
      ];
      const activities = groupActivities(groupId, 2, 1)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          latestActivityDate: earlierDate,
        }),
      ]);
    });

    it.each([
      [0, 1, O.none],
      [9, 1, O.none],
      [11, 1, O.some(2)],
      [20, 1, O.some(2)],
      [20, 2, O.none],
      [21, 2, O.some(3)],
      [21, 3, O.none],
    ])('returns the next page in the list if there is one', (numberOfEvents, page, expected) => {
      const events = generateNEventsForGroup(numberOfEvents, groupId);
      const { nextPageNumber } = groupActivities(groupId, page, 10)(events);

      expect(nextPageNumber).toStrictEqual(expected);
    });
  });

  describe('when another group evaluates an article previously evaluated by this group', () => {
    it('orders by the evaluation date of this group', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const articleMostRecentlyReviewedByThisGroup = arbitraryDoi();
      const articleThatWasMoreRecentlyReviewedButByAnotherGroup = arbitraryDoi();
      const events = [
        editorialCommunityReviewedArticle(
          thisGroupId,
          articleThatWasMoreRecentlyReviewedButByAnotherGroup,
          arbitraryReviewId(),
          new Date('1980-01-01'),
        ),
        editorialCommunityReviewedArticle(
          thisGroupId,
          articleMostRecentlyReviewedByThisGroup,
          arbitraryReviewId(),
          new Date('2000-01-01'),
        ),
        editorialCommunityReviewedArticle(
          anotherGroupId,
          articleThatWasMoreRecentlyReviewedButByAnotherGroup,
          arbitraryReviewId(),
          new Date('2020-01-01'),
        ),
      ];

      const activities = groupActivities(thisGroupId, 1, pageSize)(events);

      expectContentOf(activities, [
        expect.objectContaining({
          doi: articleMostRecentlyReviewedByThisGroup,
        }),
        expect.objectContaining({
          doi: articleThatWasMoreRecentlyReviewedButByAnotherGroup,
        }),
      ]);
    });
  });

  describe('when the group has not evaluated any articles', () => {
    it('returns an empty list', () => {
      const thisGroupId = arbitraryGroupId();
      const anotherGroupId = arbitraryGroupId();
      const events = [
        editorialCommunityReviewedArticle(
          anotherGroupId,
          arbitraryDoi(),
          arbitraryReviewId(),
          arbitraryDate(),
        ),
      ];

      const activities = groupActivities(thisGroupId, 1, pageSize)(events);

      expectContentOf(activities, []);
    });
  });
});

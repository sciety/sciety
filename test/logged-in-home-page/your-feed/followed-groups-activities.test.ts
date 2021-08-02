import { performance } from 'perf_hooks';
import {
  editorialCommunityReviewedArticle,
  EditorialCommunityReviewedArticleEvent,
} from '../../../src/domain-events';
import { followedGroupsActivities } from '../../../src/logged-in-home-page/your-feed/followed-groups-activities';
import { Doi } from '../../../src/types/doi';
import { GroupId } from '../../../src/types/group-id';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId, groupIdFromString } from '../../types/group-id.helper';
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

describe('followed-groups-activities', () => {
  describe('when only a single group has evaluated an article once', () => {
    const articleId = arbitraryDoi();
    const groupId = '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa';
    const events = [
      editorialCommunityReviewedArticle(
        groupIdFromString(groupId),
        articleId,
        arbitraryReviewId(),
        new Date('2020-12-15T00:00:00.000Z'),
      ),
    ];

    it('includes the article DOI', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of 1', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          evaluationCount: 1,
        }),
      ]);
    });

    it('latest activity date matches event date', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: new Date('2020-12-15T00:00:00.000Z'),
        }),
      ]);
    });
  });

  describe('when only a not followed group has evaluated an article', () => {
    it('does not include the article DOI', () => {
      const followedGroupId = arbitraryGroupId();
      const notFollowedGroupId = arbitraryGroupId();
      const events = [
        editorialCommunityReviewedArticle(
          notFollowedGroupId,
          arbitraryDoi(),
          arbitraryReviewId(),
          new Date('2021-03-10T00:00:00.000Z'),
        ),
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([]);
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
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
        }),
      ]);
    });

    it('has an evaluation count of the number of evaluations', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          evaluationCount: 2,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
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
        new Date('2021-03-10T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        new Date('2021-03-10T00:00:00.000Z'),
      ),
      editorialCommunityReviewedArticle(
        otherGroupId,
        articleId,
        arbitraryReviewId(),
        new Date('2021-03-10T00:00:00.000Z'),
      ),
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleId,
          evaluationCount: 4,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation by any group', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: new Date('2021-03-10T00:00:00.000Z'),
        }),
      ]);
    });
  });

  describe('when one of the groups has evaluated multiple articles', () => {
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
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityDate: laterDate,
        }),
        expect.objectContaining({
          latestActivityDate: earlierDate,
        }),
      ]);
    });

    it('limits the number of entries to 20', () => {
      const events = generateNEventsForGroup(25, groupId);
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toHaveLength(20);
    });
  });

  describe('when another not followed group evaluates an article previously evaluated by a followed group', () => {
    it('orders by the latest activity date by any group', () => {
      const followedGroupId = arbitraryGroupId();
      const notFollowedGroupId = arbitraryGroupId();
      const articleMostRecentlyReviewedByTheFollowedGroup = arbitraryDoi();
      const articleThatWasMoreRecentlyReviewedButByTheUnfollowedGroup = arbitraryDoi();
      const events = [
        editorialCommunityReviewedArticle(
          followedGroupId,
          articleThatWasMoreRecentlyReviewedButByTheUnfollowedGroup,
          arbitraryReviewId(),
          new Date('1980-01-01'),
        ),
        editorialCommunityReviewedArticle(
          followedGroupId,
          articleMostRecentlyReviewedByTheFollowedGroup,
          arbitraryReviewId(),
          new Date('2000-01-01'),
        ),
        editorialCommunityReviewedArticle(
          notFollowedGroupId,
          articleThatWasMoreRecentlyReviewedButByTheUnfollowedGroup,
          arbitraryReviewId(),
          new Date('2020-01-01'),
        ),
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          doi: articleThatWasMoreRecentlyReviewedButByTheUnfollowedGroup,
        }),
        expect.objectContaining({
          doi: articleMostRecentlyReviewedByTheFollowedGroup,
        }),
      ]);
    });
  });

  describe('given a large set of evaluation events', () => {
    const numberOfEvents = 15000;

    const events = (
      [...Array(numberOfEvents)].map(() => editorialCommunityReviewedArticle(
        arbitraryGroupId(),
        arbitraryDoi(),
        arbitraryReviewId(),
        arbitraryDate(),
      ))
    );

    it('performs acceptably', () => {
      const startTime = performance.now();
      followedGroupsActivities(events)([arbitraryGroupId()]);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(200);
    });
  });
});

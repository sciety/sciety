import { performance } from 'perf_hooks';
import * as O from 'fp-ts/Option';
import { evaluationRecorded } from '../../../../src/domain-events';
import { followedGroupsActivities } from '../../../../src/html-pages/my-feed-page/my-feed/followed-groups-activities';
import { arbitraryDate } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId, groupIdFromString } from '../../../types/group-id.helper';
import { arbitraryReviewId } from '../../../types/review-id.helper';

describe('followed-groups-activities', () => {
  describe('when only a single group has evaluated an article once', () => {
    const articleId = arbitraryArticleId();
    const groupId = '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa';
    const latestEvaluationPublishedDate = new Date('2020-12-15T00:00:00.000Z');
    const events = [
      evaluationRecorded(
        groupIdFromString(groupId),
        articleId,
        arbitraryReviewId(),
        [],
        latestEvaluationPublishedDate,
        arbitraryDate(),
      ),
    ];

    it('includes the article DOI', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          articleId,
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

    it('latest activity date matches the evaluation published date', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityAt: O.some(latestEvaluationPublishedDate),
        }),
      ]);
    });
  });

  describe('when only a not followed group has evaluated an article', () => {
    it('does not include the article DOI', () => {
      const followedGroupId = arbitraryGroupId();
      const notFollowedGroupId = arbitraryGroupId();
      const events = [
        evaluationRecorded(notFollowedGroupId, arbitraryArticleId(), arbitraryReviewId(), [], new Date(), new Date('2021-03-10T00:00:00.000Z')),
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([]);
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    const groupId = arbitraryGroupId();
    const articleId = arbitraryArticleId();
    const latestEvaluationPublishedDate = new Date('2020-01-01');
    const events = [
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], new Date('1980-01-01'), arbitraryDate()),
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], latestEvaluationPublishedDate, arbitraryDate()),
    ];

    it('has a single entry for the article', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          articleId,
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
          latestActivityAt: O.some(latestEvaluationPublishedDate),
        }),
      ]);
    });
  });

  describe('when multiple groups have evaluated an article', () => {
    const groupId = arbitraryGroupId();
    const otherGroupId = arbitraryGroupId();
    const articleId = arbitraryArticleId();
    const events = [
      evaluationRecorded(groupId, articleId, arbitraryReviewId(), [], new Date('2020-10-14T00:00:00.000Z'), arbitraryDate()),
      evaluationRecorded(otherGroupId, articleId, arbitraryReviewId(), [], new Date('2021-03-10T00:00:00.000Z'), arbitraryDate()),
      evaluationRecorded(otherGroupId, articleId, arbitraryReviewId(), [], new Date('2021-03-10T00:00:00.000Z'), arbitraryDate()),
      evaluationRecorded(otherGroupId, articleId, arbitraryReviewId(), [], new Date('2021-03-10T00:00:00.000Z'), arbitraryDate()),
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          articleId,
          evaluationCount: 4,
        }),
      ]);
    });

    it('has a latest activity date of the latest evaluation by any group', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          latestActivityAt: O.some(new Date('2021-03-10T00:00:00.000Z')),
        }),
      ]);
    });
  });

  describe('when one of the groups has evaluated multiple articles', () => {
    const groupId = arbitraryGroupId();

    it('returns the article with the most recently recorded evaluation first', () => {
      const earlierArticle = arbitraryArticleId();
      const laterArticle = arbitraryArticleId();
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const events = [
        evaluationRecorded(groupId, earlierArticle, arbitraryReviewId(), [], new Date(), earlierDate),
        evaluationRecorded(groupId, laterArticle, arbitraryReviewId(), [], new Date(), laterDate),
      ];
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          articleId: laterArticle,
        }),
        expect.objectContaining({
          articleId: earlierArticle,
        }),
      ]);
    });
  });

  describe('when another not followed group evaluates an article previously evaluated by a followed group', () => {
    it('orders by the most recently recorded evaluation by a followed group', () => {
      const followedGroupId = arbitraryGroupId();
      const notFollowedGroupId = arbitraryGroupId();
      const articleA = arbitraryArticleId();
      const articleB = arbitraryArticleId();
      const events = [
        evaluationRecorded(followedGroupId, articleB, arbitraryReviewId(), [], new Date(), new Date('1980-01-01')),
        evaluationRecorded(followedGroupId, articleA, arbitraryReviewId(), [], new Date(), new Date('2000-01-01')),
        evaluationRecorded(notFollowedGroupId, articleB, arbitraryReviewId(), [], new Date(), new Date('2020-01-01')),
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          articleId: articleA,
        }),
        expect.objectContaining({
          articleId: articleB,
        }),
      ]);
    });
  });

  describe('given a large set of evaluation events', () => {
    const numberOfEvents = 15000;

    const events = (
      [...Array(numberOfEvents)].map(() => evaluationRecorded(
        arbitraryGroupId(),
        arbitraryArticleId(),
        arbitraryReviewId(),
        [],
        new Date(),
        arbitraryDate(),
      ))
    );

    it('performs acceptably', () => {
      const startTime = performance.now();
      followedGroupsActivities(events)([arbitraryGroupId()]);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(400);
    });
  });
});

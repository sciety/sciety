import { performance } from 'perf_hooks';
import { evaluationRecordedHelper } from '../../../types/evaluation-recorded-event.helper';
import { followedGroupsActivities } from '../../../../src/html-pages/my-feed-page/my-feed/followed-groups-activities';
import { arbitraryDate } from '../../../helpers';
import { arbitraryArticleId } from '../../../types/article-id.helper';
import { arbitraryGroupId, groupIdFromString } from '../../../types/group-id.helper';
import { arbitraryEvaluationLocator } from '../../../types/evaluation-locator.helper';

describe('followed-groups-activities', () => {
  describe('when only a single group has evaluated an article once', () => {
    const articleId = arbitraryArticleId();
    const groupId = '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa';
    const latestEvaluationPublishedDate = new Date('2020-12-15T00:00:00.000Z');
    const events = [
      evaluationRecordedHelper(
        groupIdFromString(groupId),
        articleId,
        arbitraryEvaluationLocator(),
        [],
        latestEvaluationPublishedDate,
        arbitraryDate(),
      ),
    ];

    it('includes the article DOI', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        articleId,
      ]);
    });
  });

  describe('when only a not followed group has evaluated an article', () => {
    it('does not include the article DOI', () => {
      const followedGroupId = arbitraryGroupId();
      const notFollowedGroupId = arbitraryGroupId();
      const events = [
        evaluationRecordedHelper(notFollowedGroupId, arbitraryArticleId(), arbitraryEvaluationLocator(), [], new Date(), new Date('2021-03-10T00:00:00.000Z')),
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
      evaluationRecordedHelper(groupId, articleId, arbitraryEvaluationLocator(), [], new Date('1980-01-01'), arbitraryDate()),
      evaluationRecordedHelper(
        groupId,
        articleId,
        arbitraryEvaluationLocator(),
        [],
        latestEvaluationPublishedDate,
        arbitraryDate(),
      ),
    ];

    it('has a single entry for the article', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        articleId,
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
        evaluationRecordedHelper(groupId, earlierArticle, arbitraryEvaluationLocator(), [], new Date(), earlierDate),
        evaluationRecordedHelper(groupId, laterArticle, arbitraryEvaluationLocator(), [], new Date(), laterDate),
      ];
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        laterArticle,
        earlierArticle,
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
        evaluationRecordedHelper(followedGroupId, articleB, arbitraryEvaluationLocator(), [], new Date(), new Date('1980-01-01')),
        evaluationRecordedHelper(followedGroupId, articleA, arbitraryEvaluationLocator(), [], new Date(), new Date('2000-01-01')),
        evaluationRecordedHelper(notFollowedGroupId, articleB, arbitraryEvaluationLocator(), [], new Date(), new Date('2020-01-01')),
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([
        articleA,
        articleB,
      ]);
    });
  });

  describe('given a large set of evaluation events', () => {
    const numberOfEvents = 15000;

    const events = (
      [...Array(numberOfEvents)].map(() => evaluationRecordedHelper(
        arbitraryGroupId(),
        arbitraryArticleId(),
        arbitraryEvaluationLocator(),
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

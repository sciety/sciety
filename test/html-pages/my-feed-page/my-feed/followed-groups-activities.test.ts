import { performance } from 'perf_hooks';
import * as O from 'fp-ts/Option';
import { DomainEvent } from '../../../../src/domain-events';
import { followedGroupsActivities } from '../../../../src/html-pages/my-feed-page/my-feed/followed-groups-activities';
import { ArticleId } from '../../../../src/types/article-id';
import { arbitraryEvaluationPublicationRecordedEvent } from '../../../domain-events/evaluation-resource-events.helper';
import { arbitraryExpressionDoi } from '../../../types/expression-doi.helper';
import { arbitraryGroupId, groupIdFromString } from '../../../types/group-id.helper';

describe('followed-groups-activities', () => {
  describe('when only a single group has evaluated an article once', () => {
    const expressionDoi = arbitraryExpressionDoi();
    const groupId = '4eebcec9-a4bb-44e1-bde3-2ae11e65daaa';
    const latestEvaluationPublishedDate = new Date('2020-12-15T00:00:00.000Z');
    const events: ReadonlyArray<DomainEvent> = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        articleId: expressionDoi,
        publishedAt: latestEvaluationPublishedDate,
        groupId: groupIdFromString(groupId),
      },
    ];

    it('includes the article DOI', () => {
      const activities = followedGroupsActivities(events)([groupIdFromString(groupId)]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          expressionDoi: new ArticleId(expressionDoi),
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
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: notFollowedGroupId,
          date: new Date('2021-03-10T00:00:00.000Z'),
        },
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([]);
    });
  });

  describe('when only a single group has evaluated an article more than once', () => {
    const groupId = arbitraryGroupId();
    const expressionDoi = arbitraryExpressionDoi();
    const latestEvaluationPublishedDate = new Date('2020-01-01');
    const events: ReadonlyArray<DomainEvent> = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
        publishedAt: new Date('1980-01-01'),
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
        publishedAt: latestEvaluationPublishedDate,
      },
    ];

    it('has a single entry for the article', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          expressionDoi: new ArticleId(expressionDoi),
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
    const expressionDoi = arbitraryExpressionDoi();
    const events: ReadonlyArray<DomainEvent> = [
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId,
        articleId: expressionDoi,
        publishedAt: new Date('2020-10-14T00:00:00.000Z'),
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: otherGroupId,
        articleId: expressionDoi,
        publishedAt: new Date('2021-03-10T00:00:00.000Z'),
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: otherGroupId,
        articleId: expressionDoi,
        publishedAt: new Date('2021-03-10T00:00:00.000Z'),
      },
      {
        ...arbitraryEvaluationPublicationRecordedEvent(),
        groupId: otherGroupId,
        articleId: expressionDoi,
        publishedAt: new Date('2021-03-10T00:00:00.000Z'),
      },
    ];

    it('has an evaluation count of the number of evaluations by all groups', () => {
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          expressionDoi: new ArticleId(expressionDoi),
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
      const earlierArticle = arbitraryExpressionDoi();
      const laterArticle = arbitraryExpressionDoi();
      const earlierDate = new Date('2019-09-06T00:00:00.000Z');
      const laterDate = new Date('2019-12-05T00:00:00.000Z');
      const events: ReadonlyArray<DomainEvent> = [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId,
          articleId: earlierArticle,
          date: earlierDate,
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId,
          articleId: laterArticle,
          date: laterDate,
        },
      ];
      const activities = followedGroupsActivities(events)([groupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          expressionDoi: new ArticleId(laterArticle),
        }),
        expect.objectContaining({
          expressionDoi: new ArticleId(earlierArticle),
        }),
      ]);
    });
  });

  describe('when another not followed group evaluates an article previously evaluated by a followed group', () => {
    it('orders by the most recently recorded evaluation by a followed group', () => {
      const followedGroupId = arbitraryGroupId();
      const notFollowedGroupId = arbitraryGroupId();
      const articleA = arbitraryExpressionDoi();
      const articleB = arbitraryExpressionDoi();
      const events: ReadonlyArray<DomainEvent> = [
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: followedGroupId,
          articleId: articleB,
          date: new Date('1980-01-01'),
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: followedGroupId,
          articleId: articleA,
          date: new Date('2000-01-01'),
        },
        {
          ...arbitraryEvaluationPublicationRecordedEvent(),
          groupId: notFollowedGroupId,
          articleId: articleB,
          date: new Date('2020-01-01'),
        },
      ];

      const activities = followedGroupsActivities(events)([followedGroupId]);

      expect(activities).toStrictEqual([
        expect.objectContaining({
          expressionDoi: new ArticleId(articleA),
        }),
        expect.objectContaining({
          expressionDoi: new ArticleId(articleB),
        }),
      ]);
    });
  });

  describe('given a large set of evaluation events', () => {
    const numberOfEvents = 15000;

    const events = (
      [...Array(numberOfEvents)].map(() => (arbitraryEvaluationPublicationRecordedEvent())));

    it('performs acceptably', () => {
      const startTime = performance.now();
      followedGroupsActivities(events)([arbitraryGroupId()]);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(400);
    });
  });
});

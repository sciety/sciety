import { pipe } from 'fp-ts/function';
import { evaluationRecorded } from '../../src/domain-events';
import { collapseCloseEvents } from '../../src/sciety-feed-page/collapse-close-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('collapse-close-events', () => {
  describe('given consecutive events in which the same group evaluated an article', () => {
    it('collapses the events into a single feed item', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();
      const date = new Date('2021-09-14 12:00');
      const earlierDate = new Date('2021-09-14 11:00');

      const result = pipe(
        [
          evaluationRecorded(groupId, articleId, arbitraryReviewId(), date),
          evaluationRecorded(groupId, articleId, arbitraryReviewId(), earlierDate),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId,
          evaluationCount: 2,
          date,
        },
      ]);
    });

    it('collapses three events into a single feed item', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();

      const result = pipe(
        [
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
          evaluationRecorded(groupId, articleId, arbitraryReviewId()),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId,
          evaluationCount: 3,
          date: expect.any(Date),
        },
      ]);
    });
  });

  describe('given consecutive events in which the same group evaluated different articles', () => {
    it('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();

      const events = [
        evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId()),
        evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId()),
        evaluationRecorded(groupId, arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([expect.objectContaining({
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 3,
      })]);
    });
  });

  describe('given two consecutive series of events in which the same group evaluated two different articles', () => {
    it('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();
      const firstArticleId = arbitraryDoi();
      const secondArticleId = arbitraryDoi();

      const result = pipe(
        [
          evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
          evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
          evaluationRecorded(groupId, secondArticleId, arbitraryReviewId()),
          evaluationRecorded(groupId, secondArticleId, arbitraryReviewId()),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([expect.objectContaining({
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 2,
      })]);
    });
  });

  describe('given a group reviewing article 1 twice, then article 2 once, and then article 1 again', () => {
    it('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();
      const firstArticleId = arbitraryDoi();
      const secondArticleId = arbitraryDoi();

      const result = pipe(
        [
          evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
          evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
          evaluationRecorded(groupId, secondArticleId, arbitraryReviewId()),
          evaluationRecorded(groupId, firstArticleId, arbitraryReviewId()),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([expect.objectContaining({
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 2,
      })]);
    });
  });

  describe('given consecutive events in which different groups evaluated an article', () => {
    it('does not collapse the events', () => {
      const articleId = arbitraryDoi();

      const events = [
        evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
        evaluationRecorded(arbitraryGroupId(), articleId, arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual(events);
    });
  });

  describe('given group one evaluates 2 articles separated by group two reviewing an article', () => {
    it('does not collapse the events', () => {
      const groupOne = arbitraryGroupId();
      const groupTwo = arbitraryGroupId();

      const events = [
        evaluationRecorded(groupOne, arbitraryDoi(), arbitraryReviewId()),
        evaluationRecorded(groupTwo, arbitraryDoi(), arbitraryReviewId()),
        evaluationRecorded(groupOne, arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual(events);
    });
  });
});

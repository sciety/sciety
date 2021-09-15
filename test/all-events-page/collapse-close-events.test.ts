import { pipe } from 'fp-ts/function';
import { collapseCloseEvents } from '../../src/all-events-page/collapse-close-events';
import { groupEvaluatedArticle } from '../../src/domain-events';
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
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId(), date),
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId(), earlierDate),
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
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, articleId, arbitraryReviewId()),
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
    it.skip('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const articleId3 = arbitraryDoi();

      const events = [
        groupEvaluatedArticle(groupId, articleId1, arbitraryReviewId()),
        groupEvaluatedArticle(groupId, articleId2, arbitraryReviewId()),
        groupEvaluatedArticle(groupId, articleId3, arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([{
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 3,
        date: expect.any(Date),
      }]);
    });
  });

  describe('given two consecutive series of events in which the same group evaluated two different articles', () => {
    it.skip('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();
      const firstArticleId = arbitraryDoi();
      const secondArticleId = arbitraryDoi();

      const result = pipe(
        [
          groupEvaluatedArticle(groupId, firstArticleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, firstArticleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, secondArticleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, secondArticleId, arbitraryReviewId()),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedMultipleArticles',
          groupId,
          articleCount: 2,
          date: expect.any(Date),
        },
      ]);
    });
  });

  describe('given a group reviewing article 1 twice, then article 2 once, and then article 1 again', () => {
    it.skip('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();
      const firstArticleId = arbitraryDoi();
      const secondArticleId = arbitraryDoi();

      const result = pipe(
        [
          groupEvaluatedArticle(groupId, firstArticleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, firstArticleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, secondArticleId, arbitraryReviewId()),
          groupEvaluatedArticle(groupId, firstArticleId, arbitraryReviewId()),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedMultipleArticles',
          groupId,
          articleCount: 2,
          date: expect.any(Date),
        },
      ]);
    });
  });

  describe('given consecutive events in which different groups evaluated an article', () => {
    it('does not collapse the events', () => {
      const articleId = arbitraryDoi();

      const events = [
        groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
        groupEvaluatedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
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
        groupEvaluatedArticle(groupOne, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(groupTwo, arbitraryDoi(), arbitraryReviewId()),
        groupEvaluatedArticle(groupOne, arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual(events);
    });
  });
});

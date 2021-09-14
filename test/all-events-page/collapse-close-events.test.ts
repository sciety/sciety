import { pipe } from 'fp-ts/function';
import { collapseCloseEvents } from '../../src/all-events-page/collapse-close-events';
import { editorialCommunityReviewedArticle } from '../../src/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('collapse-close-events', () => {
  describe('given consecutive events in which the same group evaluated an article', () => {
    it.skip('collapses the events into a single feed item', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();
      const date = new Date('2021-09-14 12:00');
      const earlierDate = new Date('2021-09-14 11:00');

      const result = pipe(
        [
          editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId(), date),
          editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId(), earlierDate),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId,
          reviewCount: 2,
          date,
        },
      ]);
    });

    it.skip('collapses three events into a single feed item', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();

      const result = pipe(
        [
          editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId,
          reviewCount: 3,
          date: expect.any(Date),
        },
      ]);
    });
  });

  describe('given consecutive events in which the same group evaluated different articles', () => {
    it.skip('collapses into one feed item', () => {
      const groupId = arbitraryGroupId();

      const events = [
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([{
        type: 'CollapsedGroupEvaluatedMultipleArticles',
        groupId,
        articleCount: 2,
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
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, secondArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, secondArticleId, arbitraryReviewId()),
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
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, secondArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
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
        editorialCommunityReviewedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
        editorialCommunityReviewedArticle(arbitraryGroupId(), articleId, arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual(events);
    });
  });
});

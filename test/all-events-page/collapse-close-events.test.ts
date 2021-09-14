import { pipe } from 'fp-ts/function';
import { collapseCloseEvents } from '../../src/all-events-page/collapse-close-events';
import { editorialCommunityReviewedArticle } from '../../src/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('collapse-close-events', () => {
  describe('given consecutive events in which the same group evaluated an article', () => {
    it('collapses the events into a single feed item', () => {
      const groupId = arbitraryGroupId();
      const articleId = arbitraryDoi();

      const result = pipe(
        [
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
        },
      ]);
    });

    it('collapses three events into a single feed item', () => {
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
        },
      ]);
    });
  });

  describe('given two consecutive series of events in which the same group evaluated two different articles', () => {
    it('collapses into two feed items', () => {
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
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId: firstArticleId,
        },
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId: secondArticleId,
        },
      ]);
    });
  });

  describe('given a group reviewing article 1 twice, then article 2 once, and then article 1 again', () => {
    it('returns three feed items', () => {
      const groupId = arbitraryGroupId();
      const firstArticleId = arbitraryDoi();
      const secondArticleId = arbitraryDoi();
      const event3 = editorialCommunityReviewedArticle(groupId, secondArticleId, arbitraryReviewId());
      const event4 = editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId());

      const result = pipe(
        [
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
          editorialCommunityReviewedArticle(groupId, firstArticleId, arbitraryReviewId()),
          event3,
          event4,
        ],
        collapseCloseEvents,
      );

      expect(result).toStrictEqual([
        {
          type: 'CollapsedGroupEvaluatedArticle',
          groupId,
          articleId: firstArticleId,
        },
        event3,
        event4,
      ]);
    });
  });

  describe('given consecutive events in which the same group evaluated different articles', () => {
    it('does not collapse the events', () => {
      const groupId = arbitraryGroupId();

      const events = [
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = pipe(
        events,
        collapseCloseEvents,
      );

      expect(result).toStrictEqual(events);
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

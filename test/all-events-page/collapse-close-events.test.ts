import { pipe } from 'fp-ts/function';
import { collapseCloseEvents } from '../../src/all-events-page/collapse-close-events';
import { editorialCommunityReviewedArticle } from '../../src/domain-events/editorial-community-reviewed-article-event';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('collapse-close-events', () => {
  describe('given consecutive events in which the same group evaluated an article', () => {
    it.skip('collapses the events into a single feed item', () => {
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
  });

  describe('given consecutive events in which the same group evaluated different articles', () => {
    it.todo('does not collapse the events');
  });

  describe('given consecutive events in which different groups evaluated an article', () => {
    it.todo('does not collapse the events');
  });
});

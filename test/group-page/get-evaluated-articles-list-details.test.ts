import { getEvaluatedArticlesListDetails } from '../../src/group-page/get-evaluated-articles-list-details';
import { editorialCommunityReviewedArticle } from '../../src/types/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('get-evaluated-articles-list-details', () => {
  const groupId = arbitraryGroupId();

  describe('when the group has evaluated no articles', () => {
    it('returns a count of 0', () => {
      const result = getEvaluatedArticlesListDetails(groupId)([]);

      expect(result.articleCount).toStrictEqual(0);
    });
  });

  describe('when the group has evaluated some articles', () => {
    it('returns a count of the articles', () => {
      const events = [
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
        editorialCommunityReviewedArticle(groupId, arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = getEvaluatedArticlesListDetails(groupId)(events);

      expect(result.articleCount).toStrictEqual(2);
    });
  });

  describe('when the group has evaluated one article more than once', () => {
    it('returns a count of 1', () => {
      const articleId = arbitraryDoi();
      const events = [
        editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
        editorialCommunityReviewedArticle(groupId, articleId, arbitraryReviewId()),
      ];
      const result = getEvaluatedArticlesListDetails(groupId)(events);

      expect(result.articleCount).toStrictEqual(1);
    });
  });

  describe('when a different group has evaluated some articles', () => {
    it('returns a count of 0', () => {
      const events = [
        editorialCommunityReviewedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ];
      const result = getEvaluatedArticlesListDetails(groupId)(events);

      expect(result.articleCount).toStrictEqual(0);
    });
  });
});

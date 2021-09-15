import { allDocmapDois } from '../../src/docmaps/all-docmap-dois';
import { groupEvaluatedArticle } from '../../src/domain-events';
import { arbitraryDoi } from '../types/doi.helper';
import { arbitraryGroupId } from '../types/group-id.helper';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('all-docmap-dois', () => {
  describe('when there are evaluated events by the specified group', () => {
    it('returns a list of all the evaluated article ids', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const groupId = arbitraryGroupId();
      const events = [
        groupEvaluatedArticle(groupId, articleId1, arbitraryReviewId()),
        groupEvaluatedArticle(groupId, articleId2, arbitraryReviewId()),
      ];

      const dois = allDocmapDois(groupId)(events);

      expect(dois).toStrictEqual([
        articleId1,
        articleId2,
      ]);
    });
  });

  describe('when there are evaluated events by the specified group and others', () => {
    it('returns a list of article ids evaluated by the specified group', () => {
      const articleId1 = arbitraryDoi();
      const groupId = arbitraryGroupId();
      const events = [
        groupEvaluatedArticle(groupId, articleId1, arbitraryReviewId()),
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ];

      const dois = allDocmapDois(groupId)(events);

      expect(dois).toStrictEqual([
        articleId1,
      ]);
    });
  });
});

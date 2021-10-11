import { docmapIndexEntryModels } from '../../../src/docmaps/docmap-index/docmap-index-entry-models';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import { arbitraryDate } from '../../helpers';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('docmap-index-entry-models', () => {
  const supportedGroupIds = [arbitraryGroupId()];

  describe('when there are evaluated events by a supported group', () => {
    it('returns a list of all the evaluated index entry models', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const date1 = arbitraryDate();
      const date2 = arbitraryDate();
      const events = [
        groupEvaluatedArticle(supportedGroupIds[0], articleId1, arbitraryReviewId(), date1),
        groupEvaluatedArticle(supportedGroupIds[0], articleId2, arbitraryReviewId(), date2),
      ];

      const dois = docmapIndexEntryModels(supportedGroupIds)(events);

      expect(dois).toStrictEqual([
        {
          articleId: articleId1,
          groupId: supportedGroupIds[0],
          updated: date1,
        },
        {
          articleId: articleId2,
          groupId: supportedGroupIds[0],
          updated: date2,
        },
      ]);
    });
  });

  describe('when there are evaluated events by both supported and unsupported groups', () => {
    it('excludes articles evaluated by the unsupported group', () => {
      const articleId1 = arbitraryDoi();
      const events = [
        groupEvaluatedArticle(supportedGroupIds[0], articleId1, arbitraryReviewId()),
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ];

      const dois = docmapIndexEntryModels(supportedGroupIds)(events);

      expect(dois).toStrictEqual([
        expect.objectContaining({
          articleId: articleId1,
        }),
      ]);
    });
  });
});

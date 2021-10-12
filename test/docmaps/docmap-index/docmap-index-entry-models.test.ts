import { docmapIndexEntryModels } from '../../../src/docmaps/docmap-index/docmap-index-entry-models';
import { groupEvaluatedArticle } from '../../../src/domain-events';
import { arbitraryDoi } from '../../types/doi.helper';
import { arbitraryGroupId } from '../../types/group-id.helper';
import { arbitraryReviewId } from '../../types/review-id.helper';

describe('docmap-index-entry-models', () => {
  const supportedGroupIds = [arbitraryGroupId(), arbitraryGroupId()];

  describe('when there are evaluated events by a supported group', () => {
    it('returns a list of all the evaluated index entry models', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const earlierDate = new Date('1990');
      const laterDate = new Date('2000');
      const events = [
        groupEvaluatedArticle(supportedGroupIds[0], articleId1, arbitraryReviewId(), earlierDate),
        groupEvaluatedArticle(supportedGroupIds[0], articleId2, arbitraryReviewId(), laterDate),
      ];

      const dois = docmapIndexEntryModels(supportedGroupIds)(events);

      expect(dois).toStrictEqual([
        {
          articleId: articleId2,
          groupId: supportedGroupIds[0],
          updated: laterDate,
        },
        {
          articleId: articleId1,
          groupId: supportedGroupIds[0],
          updated: earlierDate,
        },
      ]);
    });
  });

  describe('when a supported group has evaluated an article multiple times', () => {
    it.todo('returns a single index entry model');

    it.todo('returns the lates updated date');
  });

  describe('when there are evaluated events by both supported and unsupported groups', () => {
    it('excludes articles evaluated by the unsupported group', () => {
      const articleId1 = arbitraryDoi();
      const articleId2 = arbitraryDoi();
      const events = [
        groupEvaluatedArticle(supportedGroupIds[0], articleId1, arbitraryReviewId()),
        groupEvaluatedArticle(supportedGroupIds[1], articleId2, arbitraryReviewId()),
        groupEvaluatedArticle(arbitraryGroupId(), arbitraryDoi(), arbitraryReviewId()),
      ];

      const dois = docmapIndexEntryModels(supportedGroupIds)(events);

      expect(dois).toHaveLength(2);
      expect(dois).toStrictEqual(expect.arrayContaining([
        expect.objectContaining({
          groupId: supportedGroupIds[0],
          articleId: articleId1,
        }),
        expect.objectContaining({
          groupId: supportedGroupIds[1],
          articleId: articleId2,
        }),
      ]));
    });
  });
});

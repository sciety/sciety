import { getEvaluatedArticlesListDetails } from '../../src/group-page/get-evaluated-articles-list-details';

describe('get-evaluated-articles-list-details', () => {
  describe('when the group has evaluated no articles', () => {
    it('returns an article count of 0', () => {
      const result = getEvaluatedArticlesListDetails([]);

      expect(result.articleCount).toStrictEqual(0);
    });
  });
});

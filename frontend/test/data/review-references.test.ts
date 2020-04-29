import reviewReferenceRepository from '../../src/data/review-references';

describe('review-reference-repository', () => {
  describe('empty repository', () => {
    it('has no review references for any article', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleDoi('10.1234/5678')).toEqual([]);
    });
  });
});

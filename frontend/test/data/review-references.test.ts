import reviewReferenceRepository from '../../src/data/review-references';

describe('review-reference-repository', () => {
  describe('empty repository', () => {
    it('has no review references for any article', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleDoi('10.1234/5678')).toEqual([]);
    });
  });

  describe('a populated repository', () => {
    reviewReferenceRepository.add({
      articleDoi: '10.1234/5679',
      reviewDoi: '10.9012/3456',
    });
    it('finds the review references that were added', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleDoi('10.1234/5679').length).toEqual(1);
    });
  });
});

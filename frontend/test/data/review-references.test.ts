import createReviewReferenceRepository from '../../src/data/review-references';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';


describe('review-reference-repository', () => {
  let reviewReferenceRepository: ReviewReferenceRepository;

  beforeEach(() => {
    reviewReferenceRepository = createReviewReferenceRepository();
  });

  describe('empty repository', () => {
    it('has no review references for any article', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleDoi('10.1234/5678')).toEqual([]);
    });
  });

  describe('a populated repository', () => {
    beforeEach(() => {
      reviewReferenceRepository.add({
        articleDoi: '10.1234/5679',
        reviewDoi: '10.9012/3456',
      });
    });
    it('finds the review references that were added', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleDoi('10.1234/5679').length).toEqual(1);
    });
  });
});

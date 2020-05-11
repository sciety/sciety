import { article3 } from '../../src/data/article-dois';
import Doi from '../../src/data/doi';
import createReviewReferenceRepository from '../../src/data/review-references';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';


describe('review-reference-repository', () => {
  let reviewReferenceRepository: ReviewReferenceRepository;

  beforeEach(() => {
    reviewReferenceRepository = createReviewReferenceRepository();
  });

  describe('empty repository', () => {
    it('has no review references for any article version', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleVersionDoi(article3)).toHaveLength(0);
    });
  });

  describe('a populated repository', () => {
    beforeEach(() => {
      reviewReferenceRepository.add(new Doi('10.1234/5679'), new Doi('10.9012/3456'));
    });

    it('finds the review references that were added', () => {
      expect(reviewReferenceRepository.findReviewDoisForArticleVersionDoi(new Doi('10.1234/5679'))).toHaveLength(1);
    });
  });
});

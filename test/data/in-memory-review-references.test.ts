import Doi from '../../src/data/doi';
import createReviewReferenceRepository from '../../src/data/in-memory-review-references';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';

describe('review-reference-repository', () => {
  let reviewReferenceRepository: ReviewReferenceRepository;

  const article1 = new Doi('10.1000/1');
  const article2 = new Doi('10.99999/2');
  const editorialCommunity1 = 'community-1';
  const editorialCommunity2 = 'community-2';

  beforeEach(() => {
    reviewReferenceRepository = createReviewReferenceRepository();
  });

  describe('when empty', () => {
    it('has no review references for any article version', () => {
      expect(reviewReferenceRepository.findReviewsForArticleVersionDoi(article1)).toHaveLength(0);
    });
  });

  describe('when populated', () => {
    beforeEach(() => {
      reviewReferenceRepository.add(article1, new Doi('10.5555/1'), editorialCommunity1);
      reviewReferenceRepository.add(article2, new Doi('10.6666/2'), editorialCommunity1);
      reviewReferenceRepository.add(article1, new Doi('10.7777/3'), editorialCommunity2);
    });

    it.each([
      [article1, 2],
      [article2, 1],
      [new Doi('10.0000/does-not-exist'), 0],
    ])('finds the review references for article %s', (articleDoi, expectedLength) => {
      expect(reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi)).toHaveLength(expectedLength);
    });
  });
});

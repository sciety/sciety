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
    const review1 = new Doi('10.5555/1');
    const review2 = new Doi('10.6666/2');
    const review3 = new Doi('10.7777/3');

    beforeEach(() => {
      reviewReferenceRepository.add(article1, review1, editorialCommunity1);
      reviewReferenceRepository.add(article2, review2, editorialCommunity1);
      reviewReferenceRepository.add(article1, review3, editorialCommunity2);
    });

    it.each([
      [article1, [review1, review3]],
      [article2, [review2]],
      [new Doi('10.0000/does-not-exist'), []],
    ])('finds the review references for article %s', (articleDoi, expectedReviews) => {
      const actualReviews = reviewReferenceRepository.findReviewsForArticleVersionDoi(articleDoi)
        .map((reviewReference) => reviewReference.reviewDoi)
        .sort();

      expect(actualReviews).toStrictEqual(expectedReviews);
    });
  });
});

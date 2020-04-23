import createFetchReview from '../../src/api/fetch-review';
import article3 from '../../src/data/article3';

describe('fetch-review "api"', (): void => {
  describe('review found', (): void => {
    it('returns the review', () => {
      const fetchReview = createFetchReview();
      const review = fetchReview(article3.reviews[0].doi);
      expect(review.doi).toBe(article3.reviews[0].doi);
    });
  });

  describe('review not found', (): void => {
    it('throws an error', () => {
      const fetchReview = createFetchReview();
      expect(() => fetchReview('10.1234/5678')).toThrow(new Error('Review DOI 10.1234/5678 not found'));
    });
  });
});

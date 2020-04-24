import createFetchReview from '../../src/api/fetch-review';
import article3 from '../../src/data/article3';

describe('fetch-review', (): void => {
  describe('review found', (): void => {
    it('returns the review', async () => {
      const fetchReview = createFetchReview();
      const review = await fetchReview(article3.reviews[0].doi);
      expect(review.doi).toBe(article3.reviews[0].doi);
    });
  });

  describe('review not found', (): void => {
    it('throws an error', () => {
      const fetchReview = createFetchReview();
      expect(fetchReview('10.1234/5678')).rejects.toStrictEqual(new Error('Review DOI 10.1234/5678 not found'));
    });
  });
});

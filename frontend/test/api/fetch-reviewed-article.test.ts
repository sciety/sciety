import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import createFetchReview from '../../src/api/fetch-review';
import article3 from '../../src/data/article3';
import shouldNotBeCalled from '../should-not-be-called';

describe('fetch-reviewed-article "api"', (): void => {
  describe('article found', (): void => {
    it('includes the article', () => {
      const fetchReview = createFetchReview();
      const fetchReviewedArticle = createFetchReviewedArticle(fetchReview);
      const reviewedArticle = fetchReviewedArticle(article3.article.doi);
      expect(reviewedArticle.article.doi).toBe(article3.article.doi);
    });

    it('includes the reviews', () => {
      const fetchReview = createFetchReview();
      const fetchReviewedArticle = createFetchReviewedArticle(fetchReview);
      const reviewedArticle = fetchReviewedArticle(article3.article.doi);
      expect(reviewedArticle.reviews).toHaveLength(1);
      expect(reviewedArticle.reviews[0].doi).toBe(article3.reviews[0].doi);
    });
  });

  describe('article not found', (): void => {
    it('throws an error', () => {
      const fetchReview = shouldNotBeCalled;
      const fetchReviewedArticle = createFetchReviewedArticle(fetchReview);
      expect(() => fetchReviewedArticle('10.1234/5678')).toThrow(new Error('Article DOI 10.1234/5678 not found'));
    });
  });
});

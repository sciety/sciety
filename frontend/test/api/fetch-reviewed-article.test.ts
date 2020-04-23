import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import article3 from '../../src/data/article3';

describe('fetch-reviewed-article "api"', (): void => {
  describe('article found', (): void => {
    it('includes the article', () => {
      const fetchReviewedArticle = createFetchReviewedArticle();
      const reviewedArticle = fetchReviewedArticle(article3.article.doi);
      expect(reviewedArticle.article.doi).toBe(article3.article.doi);
    });

    it('includes the reviews', () => {
      const fetchReviewedArticle = createFetchReviewedArticle();
      const reviewedArticle = fetchReviewedArticle(article3.article.doi);
      expect(reviewedArticle.reviews).toHaveLength(1);
      expect(reviewedArticle.reviews[0].doi).toBe(article3.reviews[0].doi);
    });
  });

  describe('article not found', (): void => {
    it('throws an error', () => {
      const fetchReviewedArticle = createFetchReviewedArticle();
      expect(() => fetchReviewedArticle('10.1234/5678')).toThrow(new Error('Article DOI 10.1234/5678 not found'));
    });
  });
});

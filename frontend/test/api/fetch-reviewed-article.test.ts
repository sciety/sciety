import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';

describe('fetch-reviewed-article "api"', (): void => {
  it('article found', () => {
    const fetchReviewedArticle = createFetchReviewedArticle();
    const articleDoi = '10.1101/833392';
    const reviewedArticle = fetchReviewedArticle(articleDoi);
    expect(reviewedArticle.article.doi).toBe(articleDoi);
  });

  it('article not found', () => {
    const fetchReviewedArticle = createFetchReviewedArticle();
    expect(() => fetchReviewedArticle('10.1234/5678')).toThrow(new Error('Article DOI 10.1234/5678 not found'));
  });
});

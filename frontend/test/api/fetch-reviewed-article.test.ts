import { FetchReview } from '../../src/api/fetch-review';
import createFetchReviewedArticle from '../../src/api/fetch-reviewed-article';
import article3 from '../../src/data/article3';
import Doi from '../../src/data/doi';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import shouldNotBeCalled from '../should-not-be-called';

describe('fetch-reviewed-article', (): void => {
  describe('article found', (): void => {
    const reviewReferenceRepository: ReviewReferenceRepository = {
      add: shouldNotBeCalled,
      findReviewDoisForArticleDoi: () => [article3.reviews[0].doi],
    };

    const fetchReview: FetchReview = async (doi) => ({
      author: 'John Doe',
      publicationDate: new Date('2010-02-01'),
      summary: 'Pretty good.',
      doi,
    });

    it('includes the article', async () => {
      const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
      const reviewedArticle = await fetchReviewedArticle(article3.article.doi);
      expect(reviewedArticle.article.doi).toBe(article3.article.doi);
    });

    it('includes the reviews', async () => {
      const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, fetchReview);
      const reviewedArticle = await fetchReviewedArticle(article3.article.doi);
      expect(reviewedArticle.reviews).toHaveLength(1);
      expect(reviewedArticle.reviews[0].doi).toBe(article3.reviews[0].doi);
    });
  });

  describe('article not found', (): void => {
    const reviewReferenceRepository: ReviewReferenceRepository = {
      add: shouldNotBeCalled,
      findReviewDoisForArticleDoi: () => [],
    };

    it('throws an error', async (): Promise<void> => {
      const fetchReviewedArticle = createFetchReviewedArticle(reviewReferenceRepository, shouldNotBeCalled);
      const expected = new Error('Article DOI 10.1234/5678 not found');

      await expect(fetchReviewedArticle(new Doi('10.1234/5678'))).rejects.toStrictEqual(expected);
    });
  });
});

import { SEE_OTHER } from 'http-status-codes';
import request from 'supertest';
import { FetchReviewedArticle } from '../../src/api/fetch-reviewed-article';
import createServer from '../../src/server';
import shouldNotBeCalled from '../should-not-be-called';
import reviewReferenceRepository from '../../src/data/review-references';

describe('reviews handler', (): void => {
  it('returns a created response', async (): Promise<void> => {
    const articleDoi = '10.1101/2000.1234';
    const articleDoiParam = encodeURIComponent(articleDoi);
    const fetchReviewedArticle: FetchReviewedArticle = shouldNotBeCalled;
    const response = await request(createServer({ reviewReferenceRepository, fetchReviewedArticle }))
      .post('/reviews')
      .send(`articledoi=${articleDoiParam}&reviewdoi=10.5281%2Fzenodo.3678326`);
    expect(response.status).toBe(SEE_OTHER);
    expect(response.header.location).toBe(`/articles/${articleDoiParam}`);
  });

  it('adds the review reference to the repository', async (): Promise<void> => {
    const articleDoi = '10.1101/2000.1234';
    const articleDoiParam = encodeURIComponent(articleDoi);
    const reviewDoi = '10.5281/zenodo.3678326';
    const reviewDoiParam = encodeURIComponent(articleDoi);
    const fetchReviewedArticle: FetchReviewedArticle = shouldNotBeCalled;
    await request(createServer({ reviewReferenceRepository, fetchReviewedArticle }))
      .post('/reviews')
      .send(`articledoi=${articleDoiParam}&reviewdoi=${reviewDoiParam}`);

    expect(reviewReferenceRepository.findReviewDoisForArticleDoi(articleDoi)).toContain(reviewDoi);
  });
});

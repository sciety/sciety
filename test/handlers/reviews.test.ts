import { Server } from 'http';
import { BAD_REQUEST, SEE_OTHER } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from './server';
import Doi from '../../src/data/doi';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';

describe('reviews handler', (): void => {
  const articleVersionDoi = new Doi('10.1101/2000.1234');

  describe('given a valid Zenodo review DOI', (): void => {
    const reviewDoi = new Doi('10.5281/zenodo.3678326');
    let server: Server;
    let reviewReferenceRepository: ReviewReferenceRepository;
    let response: Response;

    beforeEach(async (): Promise<void> => {
      ({ server, reviewReferenceRepository } = await createServer());
      response = await request(server)
        .post('/reviews')
        .type('form')
        .send({
          articleversiondoi: articleVersionDoi.value,
          editorialcommunityid: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
          reviewdoi: `http://doi.org/${reviewDoi}`,
        });
    });

    it('returns a created response', () => {
      expect(response.status).toBe(SEE_OTHER);
      expect(response.header.location).toBe(`/articles/${articleVersionDoi}`);
    });

    it('adds the review reference to the repository', async () => {
      const foundReviews = await reviewReferenceRepository.findReviewsForArticleVersionDoi(articleVersionDoi);
      const foundReviewDois = foundReviews.map((review) => review.reviewDoi);

      expect(foundReviewDois).toContainEqual(reviewDoi);
    });
  });

  it('rejects syntactically invalid input', async (): Promise<void> => {
    const { server } = await createServer();
    const invalidInput = '1.1/1.1';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({
        articleversiondoi: articleVersionDoi.value,
        editorialcommunityid: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        reviewdoi: invalidInput,
      });

    expect(response.status).toBe(BAD_REQUEST);
    expect(response.text).toBe('Error: Not a possible DOI.');
  });

  it('rejects a review DOI that is not on Zenodo', async (): Promise<void> => {
    const { server } = await createServer();
    const otherDoi = 'http://doi.org/10.1016/j.neuron.2014.09.004';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({ articleversiondoi: articleVersionDoi.value, reviewdoi: otherDoi });

    expect(response.status).toBe(BAD_REQUEST);
    expect(response.text).toBe('Not a Zenodo DOI.');
  });
});

import { BAD_REQUEST, SEE_OTHER } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from './server';
import Doi from '../../src/data/doi';

describe('reviews handler', (): void => {
  const articleDoi = new Doi('10.1101/2000.1234');

  describe('given a valid Zenodo review DOI', (): void => {
    const reviewDoi = new Doi('10.5281/zenodo.3678326');
    const { server, reviewReferenceRepository } = createServer();
    let response: Response;

    beforeEach(async (): Promise<void> => {
      response = await request(server)
        .post('/reviews')
        .type('form')
        .send({ articledoi: articleDoi.value, reviewdoi: `http://doi.org/${reviewDoi}` });
    });

    it('returns a created response', () => {
      expect(response.status).toBe(SEE_OTHER);
      expect(response.header.location).toBe(`/articles/${articleDoi}`);
    });

    it('adds the review reference to the repository', () => {
      const foundReviews = reviewReferenceRepository.findReviewDoisForArticleVersionDoi(articleDoi);

      expect(foundReviews).toContainEqual(reviewDoi);
    });
  });

  it('rejects syntactically invalid input', async (): Promise<void> => {
    const { server } = createServer();
    const invalidInput = '1.1/1.1';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({ articledoi: articleDoi.value, reviewdoi: invalidInput });

    expect(response.status).toBe(BAD_REQUEST);
    expect(response.text).toBe('Error: Not a possible DOI.');
  });

  it('rejects a review DOI that is not on Zenodo', async (): Promise<void> => {
    const { server } = createServer();
    const otherDoi = 'http://doi.org/10.1016/j.neuron.2014.09.004';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({ articledoi: articleDoi.value, reviewdoi: otherDoi });

    expect(response.status).toBe(BAD_REQUEST);
    expect(response.text).toBe('Not a Zenodo DOI.');
  });
});

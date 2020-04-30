import { BAD_REQUEST, SEE_OTHER } from 'http-status-codes';
import request from 'supertest';
import createServer from './server';
import Doi from '../../src/data/doi';

describe('reviews handler', (): void => {
  it.each([
    '10.5281/zenodo.3678326',
    'doi:10.5281/zenodo.3678326',
    'http://dx.doi.org/10.5281/zenodo.3678326',
    'https://dx.doi.org/10.5281/zenodo.3678326',
    'http://doi.org/10.5281/zenodo.3678326',
    'https://doi.org/10.5281/zenodo.3678326',
  ])('returns a created response (%s)', async (reviewDoi: string): Promise<void> => {
    const { server } = createServer();
    const articleDoi = '10.1101/2000.1234';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({ articledoi: articleDoi, reviewdoi: reviewDoi });

    expect(response.status).toBe(SEE_OTHER);
    expect(response.header.location).toBe(`/articles/${articleDoi}`);
  });

  it.each([
    ['10.5281/zenodo.3678326', '10.5281/zenodo.3678326'],
    ['doi:10.5281/zenodo.3678326', '10.5281/zenodo.3678326'],
    ['http://dx.doi.org/10.5281/zenodo.3678326', '10.5281/zenodo.3678326'],
    ['https://dx.doi.org/10.5281/zenodo.3678326', '10.5281/zenodo.3678326'],
    ['http://doi.org/10.5281/zenodo.3678326', '10.5281/zenodo.3678326'],
    ['https://doi.org/10.5281/zenodo.3678326', '10.5281/zenodo.3678326'],
  ])('adds the review reference to the repository (%s)', async (reviewDoi: string, expected: string): Promise<void> => {
    const { server, reviewReferenceRepository } = createServer();
    const articleDoi = '10.1101/2000.1234';
    await request(server)
      .post('/reviews')
      .type('form')
      .send({ articledoi: articleDoi, reviewdoi: reviewDoi });

    const foundReviews = reviewReferenceRepository.findReviewDoisForArticleDoi(new Doi(articleDoi));
    expect(foundReviews).toContainEqual(new Doi(expected));
  });

  it('rejects syntactically invalid input', async (): Promise<void> => {
    const { server } = createServer();
    const invalidInput = '1.1/1.1';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({ articledoi: '10.1101/2000.1234', reviewdoi: invalidInput });

    expect(response.status).toBe(BAD_REQUEST);
    expect(response.text).toBe('Error: Not a possible DOI.');
  });

  it('rejects a review DOI that is not on Zenodo', async (): Promise<void> => {
    const { server } = createServer();
    const otherDoi = 'http://doi.org/10.1016/j.neuron.2014.09.004';
    const response = await request(server)
      .post('/reviews')
      .type('form')
      .send({ articledoi: '10.1101/2000.1234', reviewdoi: otherDoi });

    expect(response.status).toBe(BAD_REQUEST);
    expect(response.text).toBe('Not a Zenodo DOI.');
  });
});

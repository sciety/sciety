import { OK } from 'http-status-codes';
import request from 'supertest';
import createFetchReviewedArticle from '../src/api/fetch-reviewed-article';
import createServer from '../src/server';

describe('the application', (): void => {
  it.each([
    '/',
    '/ping',
  ])('should respond with 200 OK on %s', async (path: string): Promise<void> => {
    const response = await request(createServer({ fetchReviewedArticle: createFetchReviewedArticle() })).get(path);

    expect(response.status).toBe(OK);
  });
});

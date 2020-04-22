import { OK } from 'http-status-codes';
import request from 'supertest';
import fetchArticle from '../src/api/fetch-article';
import createServer from '../src/server';

describe('the application', (): void => {
  it.each([
    '/',
    '/ping',
  ])('should respond with 200 OK on %s', async (path: string): Promise<void> => {
    const response = await request(createServer({ fetchArticle })).get(path);

    expect(response.status).toBe(OK);
  });
});

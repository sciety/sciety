import { OK } from 'http-status-codes';
import request from 'supertest';
import reviewReferenceRepository from '../src/data/review-references';
import createServer from '../src/server';
import shouldNotBeCalled from './should-not-be-called';

describe('the application', (): void => {
  it.each([
    '/',
    '/ping',
  ])('should respond with 200 OK on %s', async (path: string): Promise<void> => {
    const response = await request(createServer({
      fetchReviewedArticle: shouldNotBeCalled,
      reviewReferenceRepository,
    })).get(path);

    expect(response.status).toBe(OK);
  });
});

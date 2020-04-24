import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import { FetchReviewedArticle } from '../../src/api/fetch-reviewed-article';
import reviewReferenceRepository from '../../src/data/review-references';
import createServer from '../../src/server';
import shouldNotBeCalled from '../should-not-be-called';

describe('index handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const fetchReviewedArticle: FetchReviewedArticle = shouldNotBeCalled;
    response = await request(createServer({ fetchReviewedArticle, reviewReferenceRepository })).get('/');
  });

  it('returns a successful response', async (): Promise<void> => {
    expect(response.status).toBe(OK);
  });

  it('is HTML', async (): Promise<void> => {
    expect(response.type).toBe('text/html');
    expect(response.charset).toBe('UTF-8');
  });

  it('has an HTML5 body', async (): Promise<void> => {
    expect(response.text).toEqual(expect.stringMatching(/^<!doctype html>/i));
  });
});

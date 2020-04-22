import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import fetchArticle from '../../src/api/fetch-article';
import createServer from '../../src/server';

describe('index handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    response = await request(createServer({ fetchArticle })).get('/');
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

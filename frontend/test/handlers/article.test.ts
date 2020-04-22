import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from '../../src/server';
import article1 from '../../src/data/article1';

describe('article handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const doiParam = encodeURIComponent(article1.doi);
    response = await request(createServer()).get(`/articles/${doiParam}`);
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

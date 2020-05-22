import { PERMANENT_REDIRECT } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from '../handlers/server';

const arbitraryDoi = '10.1101/2000.1234';

describe('article redirect route', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = createServer();
    response = await request(server).get(`/articles?doi=${arbitraryDoi}`);
  });

  it('returns a redirect response', async (): Promise<void> => {
    expect(response.status).toBe(PERMANENT_REDIRECT);
  });

  it('redirects to the article page', async (): Promise<void> => {
    expect(response.header.location).toBe(`/articles/${arbitraryDoi}`);
  });
});

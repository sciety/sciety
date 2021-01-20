import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import { createTestServer } from './server';

describe('robots handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = await createTestServer();
    response = await request(server).get('/robots.txt');
  });

  it('returns a successful response', async (): Promise<void> => {
    expect(response.status).toBe(OK);
  });

  it('is plain text', async (): Promise<void> => {
    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('utf-8');
  });
});

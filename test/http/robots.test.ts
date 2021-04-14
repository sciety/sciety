import { StatusCodes } from 'http-status-codes';
import request, { Response } from 'supertest';
import { createTestServer } from './server';

describe('robots handler', () => {
  let response: Response;

  beforeEach(async () => {
    const { server } = await createTestServer();
    response = await request(server).get('/robots.txt');
  });

  it('returns a successful response', async () => {
    expect(response.status).toBe(StatusCodes.OK);
  });

  it('is plain text', async () => {
    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('utf-8');
  });
});

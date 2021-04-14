import { StatusCodes } from 'http-status-codes';
import request, { Response } from 'supertest';
import { createTestServer } from './server';

describe('ping handler', () => {
  let response: Response;

  beforeEach(async () => {
    const { server } = await createTestServer();
    response = await request(server).get('/ping');
  });

  it('returns a successful response', async () => {
    expect(response.status).toBe(StatusCodes.OK);
  });

  it('cannot be cached', async () => {
    expect(response.get('cache-control')).toBe('no-store, must-revalidate');
  });

  it('is plain text', async () => {
    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('utf-8');
  });

  it('has a body', async () => {
    expect(response.text).toBe('pong');
  });
});

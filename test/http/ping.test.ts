import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import { createTestServer } from './server';

describe('ping handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = await createTestServer();
    response = await request(server).get('/ping');
  });

  it('returns a successful response', async (): Promise<void> => {
    expect(response.status).toBe(OK);
  });

  it('cannot be cached', async (): Promise<void> => {
    expect(response.get('cache-control')).toBe('no-store, must-revalidate');
  });

  it('is plain text', async (): Promise<void> => {
    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('utf-8');
  });

  it('has a body', async (): Promise<void> => {
    expect(response.text).toBe('pong');
  });
});

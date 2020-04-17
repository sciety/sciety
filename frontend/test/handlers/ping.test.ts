import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import ping from '../../src/handlers/ping';

const makeRequest = async (): Promise<Response> => (
  request(ping()).get('/')
);

describe('ping handler', (): void => {
  it('returns a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(OK);
  });

  it('cannot be cached', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.get('cache-control')).toBe('no-store, must-revalidate');
  });

  it('is plain text', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('UTF-8');
  });

  it('has a body', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.text).toBe('pong');
  });
});

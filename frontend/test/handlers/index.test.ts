import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import index from '../../src/handlers/index';

const makeRequest = async (): Promise<Response> => (
  request(index()).get('/')
);

describe('index handler', (): void => {
  it('returns a successful response', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.status).toBe(OK);
  });

  it('is HTML', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.type).toBe('text/html');
    expect(response.charset).toBe('UTF-8');
  });

  it('has an HTML5 body', async (): Promise<void> => {
    const response = await makeRequest();

    expect(response.text).toEqual(expect.stringMatching(/^<!doctype html>/i));
  });
});

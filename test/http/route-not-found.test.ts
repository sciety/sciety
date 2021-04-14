import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { createTestServer } from './server';

describe('route-not-found', () => {
  it('returns a custom 404 page', async () => {
    const { server } = await createTestServer();
    const response = await request(server).get('/route-that-definitely-doesnt-exist-ever');

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
    expect(response.text).toContain('Oops!');
  });
});

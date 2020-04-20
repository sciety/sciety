import { OK } from 'http-status-codes';
import request from 'supertest';
import createServer from '../src/server';

describe('the application', (): void => {
  it.each([
    '/',
    '/add-review',
    '/article1',
    '/article2',
    '/ping',
  ])('should respond with 200 OK on %s', async (path: string): Promise<void> => {
    const response = await request(createServer()).get(path);

    expect(response.status).toBe(OK);
  });
});

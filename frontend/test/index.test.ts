import request from 'supertest';
import createServer from '../src/server';

describe('the application', (): void => {
  it.each([
    '/',
    '/article1.html',
    '/article2.html',
    '/ping',
  ])('should respond with 200 OK on %s', async (path: string): Promise<void> => {
    const response = await request(createServer()).get(path).redirects(1);

    expect(response.status).toBe(200);
  });
});

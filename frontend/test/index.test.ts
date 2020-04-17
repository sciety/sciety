import request from 'supertest';
import createServer from '../src/server';

describe('the application', (): void => {
  it.each(['/'])('should respond with 200 OK on %s', async (path: string): Promise<void> => {
    const response = await request(createServer()).get(path).set('Accept', '*/*');

    expect(response.status).toBe(200);
  });
});

import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from './server';

describe('robots handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = await createServer();
    response = await request(server).get('/robots.txt');
  });

  it('returns a successful response', async (): Promise<void> => {
    expect(response.status).toBe(OK);
  });

  it('is plain text', async (): Promise<void> => {
    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('utf-8');
  });

  it('disallows all bots', async (): Promise<void> => {
    expect(response.text).toStrictEqual(expect.stringContaining('User-Agent: *'));
  });

  it('disallows all pages', async (): Promise<void> => {
    expect(response.text).toStrictEqual(expect.stringContaining('Disallow: /'));
  });
});

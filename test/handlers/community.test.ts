import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from './server';

describe('community handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = createServer();
    response = await request(server).get('/communities/b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
  });

  it('returns a successful response', async (): Promise<void> => {
    expect(response.status).toBe(OK);
  });

  it('is plain text', async (): Promise<void> => {
    expect(response.type).toBe('text/plain');
    expect(response.charset).toBe('utf-8');
  });

  it('has the community name', async (): Promise<void> => {
    expect(response.text).toStrictEqual('eLife');
  });
});

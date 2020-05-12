import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import editorialCommunities from '../../src/data/editorial-communities';
import createServer from '../handlers/server';

describe('render-home-page handler', (): void => {
  let response: Response;

  beforeEach(async () => {
    const { server } = createServer();
    response = await request(server).get('/');
  });

  it('returns a successful response', async (): Promise<void> => {
    expect(response.status).toBe(OK);
  });

  it('is HTML', async (): Promise<void> => {
    expect(response.type).toBe('text/html');
    expect(response.charset).toBe('utf-8');
  });

  it('has an HTML5 body', async (): Promise<void> => {
    expect(response.text).toStrictEqual(expect.stringMatching(/^<!doctype html>/i));
  });

  it('lists all of the hard-coded editorial communities', async (): Promise<void> => {
    editorialCommunities.forEach((ec) => {
      expect(response.text).toContain(ec.name);
    });
  });
});

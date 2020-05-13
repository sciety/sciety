import { OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import createServer from '../handlers/server';

describe('render-home-page handler', (): void => {
  let response: Response;
  let editorialCommunities: EditorialCommunityRepository;

  beforeEach(async () => {
    const server = createServer();
    editorialCommunities = server.editorialCommunities;
    response = await request(server.server).get('/');
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
    editorialCommunities.all().forEach((ec) => {
      expect(response.text).toContain(ec.name);
    });
  });
});

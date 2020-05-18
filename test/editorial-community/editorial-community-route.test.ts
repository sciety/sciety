import { NOT_FOUND, OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from '../handlers/server';

describe('editorial-community route', (): void => {
  let response: Response;

  describe('when the editorial community exists', (): void => {
    beforeEach(async () => {
      const { server, editorialCommunities } = createServer();
      response = await request(server).get(`/editorial-communities/${editorialCommunities.all()[0].id}`);
    });

    it('returns a successful response', async (): Promise<void> => {
      expect(response.status).toBe(OK);
    });

    it('is HTML', async (): Promise<void> => {
      expect(response.type).toBe('text/html');
      expect(response.charset).toBe('utf-8');
    });
  });

  describe('when the editorial community does not exist', (): void => {
    beforeEach(async () => {
      const { server } = createServer();
      response = await request(server).get('/editorial-communities/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});

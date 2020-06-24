import { NOT_FOUND } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from '../handlers/server';

describe('render-editorial-community-page', (): void => {
  let response: Response;

  describe('when the editorial community exists', (): void => {
    beforeEach(async () => {
      const { server, editorialCommunities } = await createServer();
      response = await request(server).get(`/editorial-communities/${editorialCommunities.all()[0].id}`);
    });

    it('has the editorial community name', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('eLife'));
    });

    it('has the editorial community description', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('accelerate'));
    });

    it('has the editorial community article teasers', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining('Article title'));
    });
  });

  describe('when the editorial community does not exist', (): void => {
    beforeEach(async () => {
      const { server } = await createServer();
      response = await request(server).get('/editorial-communities/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});

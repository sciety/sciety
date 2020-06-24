import { NOT_FOUND } from 'http-status-codes';
import request, { Response } from 'supertest';
import Doi from '../../src/data/doi';
import createServer from '../handlers/server';

describe('article route', (): void => {
  let response: Response;

  describe('when the article is from bioRxiv', (): void => {
    const articleDoi = new Doi('10.1101/833392');

    beforeEach(async () => {
      const { server } = await createServer();
      response = await request(server).get(`/articles/${articleDoi}`);
    });

    it('returns a page containing article metadata', async (): Promise<void> => {
      expect(response.text).toStrictEqual(expect.stringContaining(articleDoi.toString()));
    });
  });

  describe('when the article does not exist', (): void => {
    beforeEach(async () => {
      const { server } = await createServer();
      response = await request(server).get('/articles/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });

  describe('when the article is not from bioRxiv', (): void => {
    beforeEach(async () => {
      const { server } = await createServer();
      response = await request(server).get('/articles/10.7554/eLife.09560');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});

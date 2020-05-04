import { NOT_FOUND, OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import createServer from './server';
import { article3 as article3Doi } from '../../src/data/article-dois';

describe('article handler', (): void => {
  let response: Response;

  describe('when the article exists', (): void => {
    beforeEach(async () => {
      const doi = article3Doi;
      const { server } = createServer();
      response = await request(server).get(`/articles/${doi}`);
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
  });

  describe('when the article does not exist', (): void => {
    beforeEach(async () => {
      const { server } = createServer();
      response = await request(server).get('/articles/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });

  describe('when the article is not from bioRxiv', (): void => {
    beforeEach(async () => {
      const { server } = createServer();
      response = await request(server).get('/articles/10.7554/eLife.09560');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});

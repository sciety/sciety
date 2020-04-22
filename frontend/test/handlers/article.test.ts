import { NOT_FOUND, OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import fetchArticle from '../../src/api/fetch-article';
import article1 from '../../src/data/article1';
import createServer from '../../src/server';

describe('article handler', (): void => {
  let response: Response;

  describe('when the article exists', (): void => {
    beforeEach(async () => {
      const doiParam = encodeURIComponent(article1.doi);
      response = await request(createServer({ fetchArticle })).get(`/articles/${doiParam}`);
    });

    it('returns a successful response', async (): Promise<void> => {
      expect(response.status).toBe(OK);
    });

    it('is HTML', async (): Promise<void> => {
      expect(response.type).toBe('text/html');
      expect(response.charset).toBe('UTF-8');
    });

    it('has an HTML5 body', async (): Promise<void> => {
      expect(response.text).toEqual(expect.stringMatching(/^<!doctype html>/i));
    });
  });

  describe('when the article does not exist', (): void => {
    beforeEach(async () => {
      response = await request(createServer({ fetchArticle })).get('/articles/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});

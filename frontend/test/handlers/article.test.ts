import { NOT_FOUND, OK } from 'http-status-codes';
import request, { Response } from 'supertest';
import { FetchReviewedArticle } from '../../src/api/fetch-reviewed-article';
import createServer from '../../src/server';
import shouldNotBeCalled from '../should-not-be-called';

describe('article handler', (): void => {
  let response: Response;

  describe('when the article exists', (): void => {
    beforeEach(async () => {
      const doi = '10.1101/2000.1234';
      const doiParam = encodeURIComponent(doi);
      const fetchReviewedArticle: FetchReviewedArticle = () => (
        {
          article: {
            category: 'Psychoceramics',
            type: 'New Results',
            doi,
            title: 'The study of cracked pots',
            abstract: 'More lorem ipsum',
            authors: [],
            publicationDate: new Date('2000-01-15'),
          },
          reviews: [],
        }
      );
      response = await request(createServer({ fetchReviewedArticle })).get(`/articles/${doiParam}`);
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
      const fetchReviewedArticle: FetchReviewedArticle = shouldNotBeCalled;
      response = await request(createServer({ fetchReviewedArticle })).get('/articles/rubbish');
    });

    it('returns a 404 response', async (): Promise<void> => {
      expect(response.status).toBe(NOT_FOUND);
    });
  });
});

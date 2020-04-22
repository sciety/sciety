import { CREATED } from 'http-status-codes';
import request from 'supertest';
import { FetchArticle } from '../../src/api/fetch-article';
import createServer from '../../src/server';

describe('reviews handler', (): void => {
  it('returns a created response', async (): Promise<void> => {
    const articleDoi = '10.1101/2000.1234';
    const articleDoiParam = encodeURIComponent(articleDoi);
    const fetchArticle: FetchArticle = () => { throw new Error('should never be called'); };
    const response = await request(createServer({ fetchArticle }))
      .post('/reviews')
      .send(`articledoi=${articleDoiParam}&reviewdoi=10.5281%2Fzenodo.3678326`);
    expect(response.status).toBe(CREATED);
    expect(response.header.location).toBe(`/articles/${articleDoiParam}`);
  });
});

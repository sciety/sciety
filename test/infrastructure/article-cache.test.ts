import { Result } from 'true-myth';
import createArticleCache from '../../src/infrastructure/article-cache';
import Doi from '../../src/types/doi';

describe('article-cache', () => {
  describe('when the required article is not in the cache', () => {
    it('makes a call to fetch-crossref-article', async () => {
      let wasCalled = false;
      const articleCache = createArticleCache(async (doi) => {
        wasCalled = true;
        return Result.ok({
          abstract: '',
          authors: [],
          doi,
          title: '',
          publicationDate: new Date(),
        });
      });
      await articleCache(new Doi('10.1101/111111'));

      expect(wasCalled).toBe(true);
    });

    it.todo('returns the returned article');

    it.todo('adds the article to the cache');
  });

  describe('when the required article is already in the cache', () => {
    it.todo('makes no call to fetch-crossref-article');

    it.todo('returns the cached article');
  });
});

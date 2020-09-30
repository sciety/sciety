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

    it('returns the fetched article', async () => {
      const fetched = {
        abstract: '',
        authors: [],
        doi: new Doi('10.1101/111111'),
        title: '',
        publicationDate: new Date(),
      };
      const articleCache = createArticleCache(async () => Result.ok(fetched));

      const actual = await articleCache(new Doi('10.1101/111111'));

      expect(actual.unsafelyUnwrap()).toBe(fetched);
    });

    describe('when the result is ok', () => {
      it('adds the article to the cache', async () => {
        let numberOfRequests = 0;
        const articleCache = createArticleCache(async (doi) => {
          numberOfRequests += 1;
          return Result.ok({
            abstract: '',
            authors: [],
            doi,
            title: '',
            publicationDate: new Date(),
          });
        });
        await articleCache(new Doi('10.1101/222222'));
        await articleCache(new Doi('10.1101/222222'));

        expect(numberOfRequests).toBe(1);
      });
    });

    describe('when the result is an error', () => {
      it.todo('does not add the article to the cache');
    });

    describe('when the DOI is requested twice simultaneously', () => {
      it.todo('collapses the calls into one');
    });
  });

  describe('when the required article is already in the cache', () => {
    it.todo('makes no call to fetch-crossref-article');

    it.todo('returns the cached article');
  });
});

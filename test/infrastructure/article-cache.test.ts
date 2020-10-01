import { Result } from 'true-myth';
import createArticleCache from '../../src/infrastructure/article-cache';
import { FetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import Doi from '../../src/types/doi';
import dummyLogger from '../dummy-logger';

describe('article-cache', () => {
  const arbitraryArticle = {
    abstract: '',
    authors: [],
    doi: new Doi('10.1101/12345678'),
    title: '',
    publicationDate: new Date(),
  };

  describe('when the required article is not in the cache', () => {
    it('makes a call to fetch-crossref-article', async () => {
      const fetchCrossrefArticle: FetchCrossrefArticle = async () => Result.ok(arbitraryArticle);
      const spy = jest.fn(fetchCrossrefArticle);
      const articleCache = createArticleCache(spy, dummyLogger);
      await articleCache(new Doi('10.1101/111111'));

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('returns the fetched article', async () => {
      const fetched = {
        abstract: '',
        authors: [],
        doi: new Doi('10.1101/111111'),
        title: '',
        publicationDate: new Date(),
      };
      const articleCache = createArticleCache(async () => Result.ok(fetched), dummyLogger);

      const actual = await articleCache(new Doi('10.1101/111111'));

      expect(actual.unsafelyUnwrap()).toBe(fetched);
    });

    describe('when the result is ok', () => {
      it('adds the article to the cache', async () => {
        const fetchCrossrefArticle: FetchCrossrefArticle = async () => Result.ok(arbitraryArticle);
        const spy = jest.fn(fetchCrossrefArticle);
        const articleCache = createArticleCache(spy, dummyLogger);
        await articleCache(new Doi('10.1101/222222'));
        await articleCache(new Doi('10.1101/222222'));

        expect(spy).toHaveBeenCalledTimes(1);
      });
    });

    describe('when the result is an error', () => {
      it('removes the article from the cache', async () => {
        const fetchCrossrefArticle: FetchCrossrefArticle = async () => Result.err('unavailable');
        const spy = jest.fn(fetchCrossrefArticle);
        const articleCache = createArticleCache(spy, dummyLogger);
        await articleCache(new Doi('10.1101/222222'));
        await articleCache(new Doi('10.1101/222222'));

        expect(spy).toHaveBeenCalledTimes(2);
      });
    });

    describe('when the DOI is requested twice simultaneously', () => {
      it('collapses the calls into one', async () => {
        const fetchCrossrefArticle: FetchCrossrefArticle = async () => Result.ok(arbitraryArticle);
        const spy = jest.fn(fetchCrossrefArticle);
        const articleCache = createArticleCache(spy, dummyLogger);
        await Promise.all([
          articleCache(new Doi('10.1101/222222')),
          articleCache(new Doi('10.1101/222222')),
        ]);

        expect(spy).toHaveBeenCalledTimes(1);
      });

      describe('and an error happens', () => {
        it('both requests fail', async () => {
          const articleCache = createArticleCache(async () => Result.err('unavailable'), dummyLogger);
          const results = await Promise.all([
            articleCache(new Doi('10.1101/222222')),
            articleCache(new Doi('10.1101/222222')),
          ]);

          expect(results[0].isErr()).toBe(true);
          expect(results[1].isErr()).toBe(true);
        });
      });
    });
  });
});

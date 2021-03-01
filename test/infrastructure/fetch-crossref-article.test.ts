import * as E from 'fp-ts/Either';
import { fetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import { Doi } from '../../src/types/doi';
import { dummyLogger } from '../dummy-logger';

describe('fetch-crossref-article', () => {
  const doi = new Doi('10.1101/339747');

  describe('the request fails', () => {
    it('returns an error result', async () => {
      const getXml = async (): Promise<never> => {
        throw new Error('HTTP timeout');
      };
      const result = await fetchCrossrefArticle(getXml, dummyLogger)(doi)();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('crossref returns an invalid XML document', () => {
    it('throws an error', async () => {
      const getXml = async (): Promise<string> => '';
      const result = await fetchCrossrefArticle(getXml, dummyLogger)(doi)();

      expect(result).toStrictEqual(E.left('unavailable'));
    });
  });
});

import * as E from 'fp-ts/Either';
import { fetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import { dummyLogger } from '../dummy-logger';
import { arbitraryDoi } from '../types/doi.helper';

describe('fetch-crossref-article', () => {
  const doi = arbitraryDoi();

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

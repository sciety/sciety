import * as E from 'fp-ts/Either';
import { createFetchCrossrefArticle, GetXml } from '../../src/infrastructure/fetch-crossref-article';
import { Doi } from '../../src/types/doi';
import dummyLogger from '../dummy-logger';

describe('fetch-crossref-article', () => {
  const doi = new Doi('10.1101/339747');

  describe('the request fails', () => {
    it('returns an error result', async () => {
      const getXml: GetXml = async () => {
        throw new Error('HTTP timeout');
      };
      const result = await createFetchCrossrefArticle(getXml, dummyLogger)(doi)();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });

  describe('crossref returns an invalid XML document', () => {
    it('throws an error', async () => {
      const getXml: GetXml = async () => '';
      const result = await createFetchCrossrefArticle(getXml, dummyLogger)(doi)();

      expect(result).toStrictEqual(E.left('unavailable'));
    });
  });
});

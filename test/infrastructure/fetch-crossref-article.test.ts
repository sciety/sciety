import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchCrossrefArticle } from '../../src/infrastructure/fetch-crossref-article';
import * as DE from '../../src/types/data-error';
import { dummyLogger } from '../dummy-logger';
import { shouldNotBeCalled } from '../should-not-be-called';
import { arbitraryDoi } from '../types/doi.helper';

describe('fetch-crossref-article', () => {
  const doi = arbitraryDoi();

  describe('the request fails', () => {
    it('returns an error result', async () => {
      const getXml = async (): Promise<never> => {
        throw new Error('HTTP timeout');
      };
      const result = await pipe(
        doi,
        fetchCrossrefArticle(getXml, dummyLogger),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isNotFound,
        )),
      )();

      expect(result).toBe(true);
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

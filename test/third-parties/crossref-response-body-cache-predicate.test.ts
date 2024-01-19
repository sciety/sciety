import { crossrefResponseBodyCachePredicate } from '../../src/third-parties/crossref-response-body-cache-predicate';
import { dummyLogger } from '../dummy-logger';
import { arbitraryUri } from '../helpers';

describe('crossref-response-body-cache-predicate', () => {
  describe('given an empty string response from Crossref', () => {
    const result = crossrefResponseBodyCachePredicate(dummyLogger)('', arbitraryUri());

    it('does not cache', () => {
      expect(result).toBe(false);
    });
  });
});

import { crossrefResponseBodyCachePredicate } from '../../src/third-parties/crossref-response-body-cache-predicate';
import { dummyLogger } from '../dummy-logger';
import { arbitraryUri } from '../helpers';

describe('crossref-response-body-cache-predicate', () => {
  describe('given a 200 response from Crossref', () => {
    describe('when the body is an empty string', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)('', arbitraryUri());

      it('does not cache', () => {
        expect(result).toBe(false);
      });
    });

    describe('when the body confusingly contains a report of a 503 status', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)('unexpected HTTP status: status=503', arbitraryUri());

      it('does not cache', () => {
        expect(result).toBe(false);
      });
    });

    describe('when the body contains an exception', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)('unexpected DoiDBrecord.get issue: null\n(org.crossref.common.exceptions.IORuntimeException occured 1/18/24 11:18 AM)', arbitraryUri());

      it.failing('does not cache', () => {
        expect(result).toBe(false);
      });
    });
  });
});

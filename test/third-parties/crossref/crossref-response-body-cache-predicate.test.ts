import { crossrefResponseBodyCachePredicate } from '../../../src/third-parties/crossref/crossref-response-body-cache-predicate';
import { dummyLogger } from '../../dummy-logger';
import { arbitraryUri } from '../../helpers';

describe('crossref-response-body-cache-predicate', () => {
  describe('given a 200 response from Crossref', () => {
    describe('when the body is a parsed json', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)(
        {
          status: 'ok',
          'message-type': 'work',
          'message-version': '1.0.0',
          message: {},
        },
        arbitraryUri(),
      );

      it('decides to cache', () => {
        expect(result).toBe(true);
      });
    });

    describe('when the body is a legitimate XML response', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)(
        `
          <?xml version="1.0" encoding="UTF-8"?>
          <doi_records>
            <doi_record owner="10.1101" timestamp="2023-12-13 16:25:39">
              <crossref>
              </crossref>
            </doi_record>
          </doi_records>
        `,
        arbitraryUri(),
      );

      it('decides to cache', () => {
        expect(result).toBe(true);
      });
    });

    describe('when the body is an empty string', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)('', arbitraryUri());

      it('decides not to cache', () => {
        expect(result).toBe(false);
      });
    });

    describe('when the body confusingly contains a report of a 503 status', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)('unexpected HTTP status: status=503', arbitraryUri());

      it('decides not to cache', () => {
        expect(result).toBe(false);
      });
    });

    describe('when the body contains an exception', () => {
      const result = crossrefResponseBodyCachePredicate(dummyLogger)('unexpected DoiDBrecord.get issue: null\n(org.crossref.common.exceptions.IORuntimeException occured 1/18/24 11:18 AM)', arbitraryUri());

      it('decides not to cache', () => {
        expect(result).toBe(false);
      });
    });
  });
});

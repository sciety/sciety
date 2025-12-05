import { isUriFromBiorxivMedrxiv } from '../../../src/ingest/evaluation-discovery/is-uri-from-biorxiv-medrxiv';
import { arbitraryString, arbitraryUri } from '../../helpers';

describe('is-uri-from-biorxiv-medrxiv', () => {
  describe('given input can be parsed as a url', () => {
    describe('and contains biorxiv hostname', () => {
      const biorxivUri = 'http://biorxiv.org/cgi/content/short/483891';

      it('returns true', () => {
        expect(isUriFromBiorxivMedrxiv(biorxivUri)).toBe(true);
      });
    });

    describe('and contains medrxiv hostname', () => {
      it.todo('returns true');
    });

    describe('and does not contain biorxiv nor medrxiv hostname', () => {
      it('returns false', () => {
        expect(isUriFromBiorxivMedrxiv(arbitraryUri())).toBe(false);
      });
    });
  });

  describe('given input can not be parsed as a url', () => {
    it('returns false', () => {
      expect(isUriFromBiorxivMedrxiv(arbitraryString())).toBe(false);
    });
  });
});

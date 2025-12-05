import {
  uriIsMissingBiorxivMedrxivDoiPrefix,
} from '../../../src/ingest/evaluation-discovery/uri-is-missing-biorxiv-medrxiv-doi-prefix';
import { arbitraryUri } from '../../helpers';

describe('uri-is-missing-biorxiv-medrxiv-prefix', () => {
  describe('when the uri contains the openrxiv DOI prefix (10.64898)', () => {
    const result = uriIsMissingBiorxivMedrxivDoiPrefix('https://www.medrxiv.org/content/10.64898/2021.06.18.21258689v1');

    it('returns false', () => {
      expect(result).toBe(false);
    });
  });

  describe('when the uri contains the Cold Spring Harbor Press DOI prefix (10.1101)', () => {
    it.todo('returns false');
  });

  describe('when the uri contains neither the DOI prefixes for openrxiv nor Cold Spring Harbor Press', () => {
    it.failing('returns true', () => {
      expect(uriIsMissingBiorxivMedrxivDoiPrefix(arbitraryUri())).toBe(true);
    });
  });
});

import * as E from 'fp-ts/Either';
import {
  deriveUriContainingBiorxivMedrxivDoiPrefix,
} from '../../src/ingest/derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { arbitraryUri } from '../helpers';

describe('derive-uri-containing-biorxiv-medrxiv-doi-prefix', () => {
  describe('when a URI containing a biorxiv or medrxiv DOI prefix is fetched', () => {
    it.todo('returns URI on the right');
  });

  describe('when a URI that does not contain a biorxiv or medrxiv DOI prefix is fetched', () => {
    const result = deriveUriContainingBiorxivMedrxivDoiPrefix(arbitraryUri());

    it.skip('returns on the left', () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});

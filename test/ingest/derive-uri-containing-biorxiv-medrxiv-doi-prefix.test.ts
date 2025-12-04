import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import {
  deriveUriContainingBiorxivMedrxivDoiPrefix,
} from '../../src/ingest/derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { arbitraryUri } from '../helpers';

const dependencies = {
  fetchHead: () => TE.left('not implemented'),
};

describe('derive-uri-containing-biorxiv-medrxiv-doi-prefix', () => {
  describe('when a URI containing a biorxiv or medrxiv DOI prefix is fetched', () => {
    const result = deriveUriContainingBiorxivMedrxivDoiPrefix(dependencies)(arbitraryUri());

    it.skip('returns URI on the right', async () => {
      expect(E.isRight(await result())).toBe(true);
    });
  });

  describe('when a URI that does not contain a biorxiv or medrxiv DOI prefix is fetched', () => {
    const result = deriveUriContainingBiorxivMedrxivDoiPrefix(dependencies)(arbitraryUri());

    it.skip('returns on the left', async () => {
      expect(E.isLeft(await result())).toBe(true);
    });
  });
});

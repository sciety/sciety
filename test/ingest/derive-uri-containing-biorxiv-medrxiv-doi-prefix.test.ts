import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { arbitraryAnnotation } from './helpers';
import {
  deriveUriContainingBiorxivMedrxivDoiPrefix,
} from '../../src/ingest/derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { shouldNotBeCalled } from '../should-not-be-called';

const dependencies = {
  fetchHead: () => TE.left('not implemented'),
};

describe('derive-uri-containing-biorxiv-medrxiv-doi-prefix', () => {
  describe('when a URI containing a biorxiv or medrxiv DOI prefix is fetched', () => {
    const annotation = arbitraryAnnotation();
    let result: string;

    beforeEach(async () => {
      result = await pipe(
        annotation.uri,
        deriveUriContainingBiorxivMedrxivDoiPrefix(dependencies),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it.skip('returns URI on the right', async () => {
      expect(result).toBe(true);
    });
  });

  describe('when a URI that does not contain a biorxiv or medrxiv DOI prefix is fetched', () => {
    const annotation = arbitraryAnnotation();

    const result = deriveUriContainingBiorxivMedrxivDoiPrefix(dependencies)(annotation.uri);

    it.skip('returns on the left', async () => {
      expect(E.isLeft(await result())).toBe(true);
    });
  });
});

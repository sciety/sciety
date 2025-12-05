import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { arbitraryAnnotation } from './helpers';
import {
  deriveUriContainingBiorxivMedrxivDoiPrefix,
} from '../../src/ingest/derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { arbitraryUri } from '../helpers';
import { shouldNotBeCalled } from '../should-not-be-called';

const dependencies = {
  fetchHead: () => TE.left('not implemented'),
};

describe('derive-uri-containing-biorxiv-medrxiv-doi-prefix', () => {
  describe('when a URI containing a biorxiv or medrxiv DOI prefix is fetched', () => {
    const inputUri = arbitraryUri();
    const expectedResult = 'https://biorxiv.org/content/10.64898/2021.11.04.467308v1';
    let result: string;

    beforeEach(async () => {
      result = await pipe(
        inputUri,
        deriveUriContainingBiorxivMedrxivDoiPrefix({
          fetchHead: () => TE.right({ link: expectedResult }),
        }),
        TE.getOrElse(shouldNotBeCalled),
      )();
    });

    it('returns the fetched URI', async () => {
      expect(result).toStrictEqual(expectedResult);
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

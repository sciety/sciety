import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import {
  deriveUriContainingBiorxivMedrxivDoiPrefix,
} from '../../../src/ingest/legacy/derive-uri-containing-biorxiv-medrxiv-doi-prefix';
import { arbitraryUri } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';

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
    const inputUri = arbitraryUri();
    const responseThatDoesNotContainRequiredPrefix = 'https://biorxiv.org/cgi/content/short/483891';
    let result: E.Either<string, string>;

    beforeEach(async () => {
      result = await pipe(
        inputUri,
        deriveUriContainingBiorxivMedrxivDoiPrefix({
          fetchHead: () => TE.right({ link: responseThatDoesNotContainRequiredPrefix }),
        }),
      )();
    });

    it('returns on the left', async () => {
      expect(E.isLeft(result)).toBe(true);
    });
  });
});

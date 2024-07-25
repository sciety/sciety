import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchEvaluationDigestFromAppropriateService } from '../../../src/third-parties/fetch-evaluation-digest/fetch-evaluation-digest-from-appropriate-service';
import * as DE from '../../../src/types/data-error';
import { toEvaluationLocator } from '../../../src/types/evaluation-locator';
import { arbitrarySanitisedHtmlFragment } from '../../helpers';

describe('fetch-evaluation-digest-from-appropriate-service', () => {
  let result: E.Either<unknown, unknown>;

  describe('when an evaluation digest fetcher for the inferred host is found', () => {
    const evaluationLocator = toEvaluationLocator('hypothesis:123');
    const digest = arbitrarySanitisedHtmlFragment();
    const fetchersByHost = {
      hypothesis: () => TE.right(digest),
    };

    beforeEach(async () => {
      result = await fetchEvaluationDigestFromAppropriateService(fetchersByHost)({})(evaluationLocator)();
    });

    it.failing('returns the fetched evaluation digest', async () => {
      expect(result).toStrictEqual(E.right(digest));
    });
  });

  describe('when an evaluation digest fetcher for the inferred host cannot be found', () => {
    // SMELL: we should be able to use `${arbitraryString()}:123` instead
    const evaluationLocator = toEvaluationLocator('hypothesis:123');

    beforeEach(async () => {
      result = await fetchEvaluationDigestFromAppropriateService({})({})(evaluationLocator)();
    });

    it('returns not found', async () => {
      expect(result).toStrictEqual(E.left(DE.notFound));
    });
  });
});

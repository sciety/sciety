import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchEvaluationDigestFromAppropriateService } from '../../../src/third-parties/fetch-evaluation-digest/fetch-evaluation-digest-from-appropriate-service';
import * as DE from '../../../src/types/data-error';
import { toEvaluationLocator } from '../../../src/types/evaluation-locator';
import { arbitrarySanitisedHtmlFragment } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

describe('fetch-evaluation-digest-from-appropriate-service', () => {
  describe('when an evaluation digest fetcher for the inferred host is found', () => {
    const evaluationLocator = toEvaluationLocator('hypothesis:123');
    const digest = arbitrarySanitisedHtmlFragment();
    const fetchersByHost = {
      hypothesis: () => TE.right(digest),
    };
    let result: E.Either<unknown, unknown>;

    beforeEach(async () => {
      result = await fetchEvaluationDigestFromAppropriateService(fetchersByHost)({})(evaluationLocator)();
    });

    it.failing('returns the fetched evaluation digest', async () => {
      expect(result).toStrictEqual(E.right(digest));
    });
  });

  describe('when the service is not configured', () => {
    it('returns not found', async () => {
      const fetchers = {};

      const id = arbitraryEvaluationLocator();
      const result = await pipe(
        id,
        fetchEvaluationDigestFromAppropriateService({})(fetchers),
        T.map(flow(
          E.matchW(
            identity,
            shouldNotBeCalled,
          ),
          DE.isNotFound,
        )),
      )();

      expect(result).toBe(true);
    });
  });
});

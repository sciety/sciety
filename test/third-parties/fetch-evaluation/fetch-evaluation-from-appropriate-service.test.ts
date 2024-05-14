import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchEvaluationFromAppropriateService } from '../../../src/third-parties/fetch-evaluation/fetch-evaluation-from-appropriate-service';
import * as DE from '../../../src/types/data-error';
import * as RI from '../../../src/types/evaluation-locator';
import { arbitrarySanitisedHtmlFragment } from '../../helpers';
import { shouldNotBeCalled } from '../../should-not-be-called';
import { arbitraryEvaluationLocator } from '../../types/evaluation-locator.helper';

describe('fetch-evaluation-from-appropriate-service', () => {
  describe('when the service is supported', () => {
    it('returns the fetched evaluation', async () => {
      const reviewId = arbitraryEvaluationLocator();
      const digest = arbitrarySanitisedHtmlFragment();
      const fetchers = {
        [RI.service(reviewId)]: () => TE.right(digest),
      };

      const result = await fetchEvaluationFromAppropriateService(fetchers)(reviewId)();

      expect(result).toStrictEqual(E.right(digest));
    });
  });

  describe('when the service is not configured', () => {
    it('returns not found', async () => {
      const fetchers = {};

      const id = arbitraryEvaluationLocator();
      const result = await pipe(
        id,
        fetchEvaluationFromAppropriateService(fetchers),
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

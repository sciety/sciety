import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { fetchReview } from '../../src/third-parties/fetch-review.js';
import * as DE from '../../src/types/data-error.js';
import * as RI from '../../src/types/evaluation-locator.js';
import { arbitrarySanitisedHtmlFragment, arbitraryUri } from '../helpers.js';
import { shouldNotBeCalled } from '../should-not-be-called.js';
import { arbitraryEvaluationLocator } from '../types/evaluation-locator.helper.js';
import { Evaluation } from '../../src/types/evaluation.js';

describe('fetch-review', () => {
  describe('when a service is supported', () => {
    it('returns the fetched evaluation', async () => {
      const reviewId = arbitraryEvaluationLocator();
      const evaluation: Evaluation = {
        fullText: arbitrarySanitisedHtmlFragment(),
        url: new URL(arbitraryUri()),
      };
      const fetchers = {
        [RI.service(reviewId)]: () => TE.right(evaluation),
      };

      const result = await fetchReview(fetchers)(reviewId)();

      expect(result).toStrictEqual(E.right(evaluation));
    });
  });

  describe('when a service is not supported', () => {
    it('returns not found', async () => {
      const fetchers = {};

      const id = arbitraryEvaluationLocator();
      const result = await pipe(
        id,
        fetchReview(fetchers),
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

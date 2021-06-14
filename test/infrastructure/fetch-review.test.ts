import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { fetchReview } from '../../src/infrastructure/fetch-review';
import * as RI from '../../src/types/review-id';
import { arbitraryHtmlFragment, arbitraryUri } from '../helpers';
import { arbitraryReviewId } from '../types/review-id.helper';

describe('fetch-review', () => {
  describe('when a service is supported', () => {
    it('returns the fetched evaluation', async () => {
      const reviewId = arbitraryReviewId();
      const evaluation = {
        fullText: arbitraryHtmlFragment(),
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

      const id = arbitraryReviewId();
      const result = await fetchReview(fetchers)(id)();

      expect(result).toStrictEqual(E.left('not-found'));
    });
  });
});

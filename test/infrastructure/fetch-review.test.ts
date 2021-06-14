import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { EvaluationFetcher, fetchReview } from '../../src/infrastructure/fetch-review';
import { ReviewId } from '../../src/types/review-id';
import { arbitraryHtmlFragment, arbitraryUri, arbitraryWord } from '../helpers';

describe('fetch-review', () => {
  describe('when a service is supported', () => {
    it('returns the fetched evaluation', async () => {
      const serviceName = arbitraryWord();
      const evaluation = {
        fullText: arbitraryHtmlFragment(),
        url: new URL(arbitraryUri()),
      };
      const fetchers = new Map<string, EvaluationFetcher>();
      fetchers.set(serviceName, () => TE.right(evaluation));

      const id = `${serviceName}:${arbitraryWord()}` as ReviewId;
      const result = await fetchReview(fetchers)(id)();

      expect(result).toStrictEqual(E.right(evaluation));
    });
  });

  describe('when a service is not supported', () => {
    it.todo('returns not found');
  });
});

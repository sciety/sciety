import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { FetchDataciteReview } from './fetch-datacite-review';
import { FetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { Doi } from '../types/doi';
import { HtmlFragment } from '../types/html-fragment';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => TE.TaskEither<'unavailable' | 'not-found', {
  fullText: HtmlFragment,
  url: URL,
}>;

export const createFetchReview = (
  fetchDataciteReview: FetchDataciteReview,
  fetchHypothesisAnnotation: FetchHypothesisAnnotation,
): FetchReview => (
  (id) => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id);
    }
    // TODO: extend case switch to return ncrc review content from fetchDataciteReview

    return pipe(
      id,
      fetchHypothesisAnnotation,
      T.map((review) => pipe(
        review.fullText,
        O.fold(
          () => E.left('unavailable' as const),
          (fullText) => E.right({
            ...review,
            fullText,
          }),
        ),
      )),
    );
  }
);

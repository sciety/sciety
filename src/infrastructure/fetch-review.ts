import { URL } from 'url';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { FetchDataciteReview } from './fetch-datacite-review';
import { FetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { Review } from './review';
import { Doi } from '../types/doi';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => T.Task<Review>;

export const createFetchReview = (
  fetchDataciteReview: FetchDataciteReview,
  fetchHypothesisAnnotation: FetchHypothesisAnnotation,
): FetchReview => (
  (id) => {
    if (id instanceof Doi) {
      const reviewUrl = `https://doi.org/${id.value}`;
      return pipe(
        id,
        fetchDataciteReview,
        TE.bimap(
          () => ({
            url: new URL(reviewUrl),
            fullText: O.none,
          }),
          (review) => ({
            ...review,
            fullText: O.some(review.fullText),
          }),
        ),
        T.map(E.fold(identity, identity)),
      );
    }

    return fetchHypothesisAnnotation(id);
  }
);

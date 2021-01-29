import * as T from 'fp-ts/Task';
import { FetchDataciteReview } from './fetch-datacite-review';
import { FetchHypothesisAnnotation } from './fetch-hypothesis-annotation';
import { Review } from './review';
import { Doi } from '../types/doi';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => T.Task<Review>;

export default (
  fetchDataciteReview: FetchDataciteReview,
  fetchHypothesisAnnotation: FetchHypothesisAnnotation,
): FetchReview => (
  (id) => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id);
    }

    return fetchHypothesisAnnotation(id);
  }
);

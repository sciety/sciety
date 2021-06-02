import * as TE from 'fp-ts/TaskEither';
import { Evaluation } from './evaluation';
import { Doi } from '../types/doi';
import { HypothesisAnnotationId } from '../types/hypothesis-annotation-id';
import { ReviewId } from '../types/review-id';

export type FetchReview = (id: ReviewId) => TE.TaskEither<'unavailable' | 'not-found', Evaluation>;

export type EvaluationFetcher = (key: string) => ReturnType<FetchReview>;

export const fetchReview = (
  fetchDataciteReview: EvaluationFetcher,
  fetchHypothesisAnnotation: EvaluationFetcher,
  fetchNcrcReview: EvaluationFetcher,
): FetchReview => (
  (id) => {
    if (id instanceof Doi) {
      return fetchDataciteReview(id.value);
    }

    if (id instanceof HypothesisAnnotationId) {
      return fetchHypothesisAnnotation(id.value);
    }

    return fetchNcrcReview(id.value);
  }
);

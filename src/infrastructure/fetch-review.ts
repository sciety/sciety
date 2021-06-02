import * as TE from 'fp-ts/TaskEither';
import { Evaluation } from './evaluation';
import * as RI from '../types/review-id';

export type FetchReview = (id: RI.ReviewId) => TE.TaskEither<'unavailable' | 'not-found', Evaluation>;

export type EvaluationFetcher = (key: string) => ReturnType<FetchReview>;

export const fetchReview = (
  fetchDataciteReview: EvaluationFetcher,
  fetchHypothesisAnnotation: EvaluationFetcher,
  fetchNcrcReview: EvaluationFetcher,
): FetchReview => (id) => {
  const fetchers = new Map<string, EvaluationFetcher>();
  fetchers.set('doi', fetchDataciteReview);
  fetchers.set('hypothesis', fetchHypothesisAnnotation);
  fetchers.set('ncrc', fetchNcrcReview);

  const f = fetchers.get(RI.service(id));
  if (f) {
    return f(RI.key(id));
  }
  return TE.left('not-found');
};

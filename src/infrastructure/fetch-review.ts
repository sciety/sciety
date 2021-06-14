import * as TE from 'fp-ts/TaskEither';
import { Evaluation } from './evaluation';
import * as RI from '../types/review-id';

export type FetchReview = (id: RI.ReviewId) => TE.TaskEither<'unavailable' | 'not-found', Evaluation>;

export type EvaluationFetcher = (key: string) => ReturnType<FetchReview>;

export const fetchReview = (fetchers: Map<string, EvaluationFetcher>): FetchReview => (id) => {
  const fetcher = fetchers.get(RI.service(id));
  if (fetcher) {
    return fetcher(RI.key(id));
  }
  return TE.left('not-found');
};

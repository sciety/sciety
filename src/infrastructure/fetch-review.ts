import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import * as RI from '../types/review-id';
import { Evaluation } from '../types/evaluation';

export type FetchReview = (id: RI.ReviewId) => TE.TaskEither<DE.DataError, Evaluation>;

export type EvaluationFetcher = (key: string) => ReturnType<FetchReview>;

export const fetchReview = (fetchers: Record<string, EvaluationFetcher>): FetchReview => (id) => pipe(
  fetchers,
  R.lookup(RI.service(id)),
  TE.fromOption(() => DE.notFound),
  TE.chain((fetcher) => fetcher(RI.key(id))),
);

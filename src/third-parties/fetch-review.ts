import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import * as RI from '../types/evaluation-locator';
import { ExternalQueries } from '../types/external-queries';

export type EvaluationFetcher = (key: string) => ReturnType<ExternalQueries['fetchReview']>;

export const fetchReview = (fetchers: Record<string, EvaluationFetcher>): ExternalQueries['fetchReview'] => (id) => pipe(
  fetchers,
  R.lookup(RI.service(id)),
  TE.fromOption(() => DE.notFound),
  TE.chain((fetcher) => fetcher(RI.key(id))),
);

import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from './external-queries';
import * as DE from '../types/data-error';
import * as EL from '../types/evaluation-locator';
import { FetchReview } from '../shared-ports';

export type EvaluationFetcher = (key: string) => ReturnType<ExternalQueries['fetchReview']>;

export const fetchReview = (fetchers: Record<string, EvaluationFetcher>): FetchReview => (id) => pipe(
  fetchers,
  R.lookup(EL.service(id)),
  TE.fromOption(() => DE.notFound),
  TE.chain((fetcher) => fetcher(EL.key(id))),
);

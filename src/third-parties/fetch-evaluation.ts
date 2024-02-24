import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error.js';
import * as EL from '../types/evaluation-locator.js';
import { EvaluationFetcher } from './evaluation-fetcher.js';
import { ExternalQueries } from './external-queries.js';

export const fetchEvaluation = (fetchers: Record<string, EvaluationFetcher>): ExternalQueries['fetchEvaluation'] => (id) => pipe(
  fetchers,
  R.lookup(EL.service(id)),
  TE.fromOption(() => DE.notFound),
  TE.chain((fetcher) => fetcher(EL.key(id))),
);

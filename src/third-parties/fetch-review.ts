import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error.js';
import * as EL from '../types/evaluation-locator.js';
import { FetchReview } from '../shared-ports/index.js';
import { EvaluationFetcher } from './evaluation-fetcher.js';

export const fetchReview = (fetchers: Record<string, EvaluationFetcher>): FetchReview => (id) => pipe(
  fetchers,
  R.lookup(EL.service(id)),
  TE.fromOption(() => DE.notFound),
  TE.chain((fetcher) => fetcher(EL.key(id))),
);

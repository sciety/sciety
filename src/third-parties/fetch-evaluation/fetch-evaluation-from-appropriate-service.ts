import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import * as DE from '../../types/data-error';
import * as EL from '../../types/evaluation-locator';
import { ExternalQueries } from '../external-queries';

export const fetchEvaluationFromAppropriateService = (fetchers: Record<string, EvaluationDigestFetcher>): ExternalQueries['fetchEvaluationDigest'] => (id) => pipe(
  fetchers,
  R.lookup(EL.service(id)),
  TE.fromOption(() => DE.notFound),
  TE.chain((fetcher) => fetcher(EL.key(id))),
);

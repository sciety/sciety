import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { EvaluationFetcher } from './fetch-review';
import * as DE from '../types/data-error';

export const fetchDoiEvaluationByPublisher = (
  evaluationFetchers: Record<string, EvaluationFetcher>,
): EvaluationFetcher => (key) => pipe(
  evaluationFetchers,
  R.lookup('10.5281'),
  O.match(
    () => TE.left(DE.unavailable),
    (evaluationFetcher) => evaluationFetcher(key),
  ),
);

import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as S from 'fp-ts/string';
import { EvaluationFetcher } from './fetch-review';
import * as DE from '../types/data-error';

const deriveFrom = (key: string) => pipe(
  key,
  S.split('/'),
  RNEA.head,
);

export const fetchDoiEvaluationByPublisher = (
  evaluationFetchers: Record<string, EvaluationFetcher>,
): EvaluationFetcher => (key) => pipe(
  evaluationFetchers,
  R.lookup(deriveFrom(key)),
  O.match(
    () => TE.left(DE.unavailable),
    (evaluationFetcher) => evaluationFetcher(key),
  ),
);

import { pipe } from 'fp-ts/function';
import * as R from 'fp-ts/Record';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as S from 'fp-ts/string';
import { EvaluationFetcher } from './evaluation-fetcher.js';
import * as DE from '../types/data-error.js';
import { Logger } from '../infrastructure/index.js';

const deriveDoiPrefixFrom = (key: string) => pipe(
  key,
  S.split('/'),
  RNEA.head,
);

export const fetchDoiEvaluationByPublisher = (
  evaluationFetchers: Record<string, EvaluationFetcher>,
  logger: Logger,
): EvaluationFetcher => (key) => pipe(
  evaluationFetchers,
  R.lookup(deriveDoiPrefixFrom(key)),
  O.match(
    () => {
      logger('warn', 'Attempt to fetch evaluation with an unknown DOI prefix', { key });
      return TE.left(DE.unavailable);
    },
    (evaluationFetcher) => evaluationFetcher(key),
  ),
);

import * as O from 'fp-ts/Option';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import * as R from 'fp-ts/Record';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as S from 'fp-ts/string';
import { EvaluationDigestFetcher } from './evaluation-digest-fetcher';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';

const deriveDoiPrefixFrom = (key: string) => pipe(
  key,
  S.split('/'),
  RNEA.head,
);

export const fetchDoiEvaluationByPublisher = (
  evaluationFetchers: Record<string, EvaluationDigestFetcher>,
  logger: Logger,
): EvaluationDigestFetcher => (key) => pipe(
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

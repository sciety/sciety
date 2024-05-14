import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../third-parties';
import * as DE from '../types/data-error';
import { EvaluationLocator } from '../types/evaluation-locator';

type Dependencies = ExternalQueries;

export const fetchEvaluationHumanReadableOriginalUrl = (
  evaluationLocator: EvaluationLocator,
  dependencies: Dependencies,
): TE.TaskEither<DE.DataError, URL> => pipe(
  evaluationLocator,
  dependencies.fetchEvaluationDigest,
  TE.map(({ url }) => url),
);

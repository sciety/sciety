import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ExternalQueries } from '../third-parties';
import * as DE from '../types/data-error';
import {
  EvaluationLocator, key, service,
} from '../types/evaluation-locator';

export const fetchEvaluationHumanReadableOriginalUrl = (
  fetchEvaluationDigest: ExternalQueries['fetchEvaluationDigest'],
) => (
  evaluationLocator: EvaluationLocator,
): TE.TaskEither<DE.DataError, URL> => {
  const selectedService = service(evaluationLocator);
  switch (selectedService) {
    case 'doi':
      return TE.right(new URL(`https://doi.org/${key(evaluationLocator)}`));
    case 'hypothesis':
      return TE.right(new URL(`https://hypothes.is/a/${key(evaluationLocator)}`));
    case 'prelights':
      return TE.right(new URL(key(evaluationLocator)));
    case 'rapidreviews':
      return TE.right(new URL(key(evaluationLocator)));
    case 'ncrc':
      return pipe(
        evaluationLocator,
        fetchEvaluationDigest,
        TE.map(({ url }) => url),
      );
  }
};

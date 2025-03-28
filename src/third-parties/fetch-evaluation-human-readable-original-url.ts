import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { fetchNcrcHumanReadableOriginalUrl } from './fetch-evaluation-digest/ncrc/fetch-ncrc-evaluation-digest';
import { Logger } from '../logger';
import * as DE from '../types/data-error';
import {
  EvaluationLocator, key, service,
} from '../types/evaluation-locator';

export const fetchEvaluationHumanReadableOriginalUrl = (
  logger: Logger,
) => (
  evaluationLocator: EvaluationLocator,
): TE.TaskEither<DE.DataError, URL> => {
  const selectedService = service(evaluationLocator);
  switch (selectedService) {
    case 'doi':
      if (key(evaluationLocator).startsWith('10.5281/')) {
        return TE.right(new URL(`https://prereview.org/reviews/${key(evaluationLocator).replace('10.5281/zenodo.', '')}`));
      }
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
        key,
        fetchNcrcHumanReadableOriginalUrl(logger),
      );
  }
};

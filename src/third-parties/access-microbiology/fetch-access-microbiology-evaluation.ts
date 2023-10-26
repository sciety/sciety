import * as TE from 'fp-ts/TaskEither';
import { Logger } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { EvaluationFetcher } from '../fetch-review';

export const fetchAccessMicrobiologyEvaluation = (logger: Logger): EvaluationFetcher => (key: string) => {
  logger('debug', 'calling fetchAccessMicrobiology', { key });
  return TE.left(DE.unavailable);
};

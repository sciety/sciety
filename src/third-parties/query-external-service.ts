import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error.js';
import { LevelName } from '../infrastructure/logger.js';

export type QueryExternalService = (
  notFoundLogLevel?: LevelName,
  headers?: Record<string, string>
) => (url: string) => TE.TaskEither<DE.DataError, unknown>;

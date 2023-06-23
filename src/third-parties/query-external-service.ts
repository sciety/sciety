import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { LevelName } from '../infrastructure/logger';

export type QueryExternalService = (
  notFoundLogLevel?: LevelName,
  headers?: Record<string, string>
) => (url: string) => TE.TaskEither<DE.DataError, unknown>;

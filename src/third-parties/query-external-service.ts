import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error.js';
import { LevelName } from '../infrastructure/logger/index.js';

type Headers = Record<string, string>;

export type QueryExternalService = (
  notFoundLogLevel?: LevelName,
  headers?: Headers,
) => (url: string) => TE.TaskEither<DE.DataError, unknown>;

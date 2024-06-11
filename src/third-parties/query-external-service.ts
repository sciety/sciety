import * as TE from 'fp-ts/TaskEither';
import { LogLevel } from '../logger';
import * as DE from '../types/data-error';

type Headers = Record<string, string>;

export type QueryExternalService = (
  notFoundLogLevel?: LogLevel,
  headers?: Headers,
) => (url: string) => TE.TaskEither<DE.DataError, unknown>;

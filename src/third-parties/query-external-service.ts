import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { LoggerLevelName } from '../shared-ports';

type Headers = Record<string, string>;

export type QueryExternalService = (
  notFoundLogLevel?: LoggerLevelName,
  headers?: Headers,
) => (url: string) => TE.TaskEither<DE.DataError, unknown>;

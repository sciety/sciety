import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { logAndTransformToDataError } from './log-and-transform-to-data-error';
import { Logger } from '../shared-ports';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { LevelName } from '../infrastructure/logger';

export type QueryExternalService = (url: string, headers?: Record<string, string>)
=> TE.TaskEither<DE.DataError, unknown>;

export const queryExternalService = (
  logger: Logger,
  cacheMaxAgeSeconds = 5 * 60,
  notFoundLogLevel: LevelName = 'warn',
): QueryExternalService => (url, headers = {}) => pipe(
  TE.tryCatch(async () => getCachedAxiosRequest(logger, cacheMaxAgeSeconds * 1000)<unknown>(url, headers), identity),
  TE.mapLeft(logAndTransformToDataError(logger, url, notFoundLogLevel)),
);

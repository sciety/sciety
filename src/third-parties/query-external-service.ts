import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { logAndTransformToDataError } from './get-json-and-log';
import { Logger } from '../shared-ports';
import { getCachedAxiosRequest } from '../infrastructure/get-cached-axios-request';
import { LevelName } from '../infrastructure/logger';

export type QueryExternalService = (url: string) => TE.TaskEither<DE.DataError, unknown>;

export const queryExternalService = (
  logger: Logger,
  cacheMaxAgeSeconds = 5 * 60,
  notFoundLogLevel: LevelName = 'warn',
): QueryExternalService => (url) => pipe(
  TE.tryCatch(async () => getCachedAxiosRequest(logger, cacheMaxAgeSeconds * 1000)<unknown>(url), identity),
  TE.mapLeft(logAndTransformToDataError(logger, url, notFoundLogLevel)),
);

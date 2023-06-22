import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { logAndTransformToDataError } from './log-and-transform-to-data-error';
import { Logger } from '../shared-ports';
import { getCachedAxiosRequest } from './get-cached-axios-request';
import { LevelName } from '../infrastructure/logger';

export type CallXYZ = (
  notFoundLogLevel?: LevelName,
  headers?: Record<string, string>
) => (url: string) => TE.TaskEither<DE.DataError, unknown>;

export const callXYZ = (
  logger: Logger,
  cacheMaxAgeSeconds = 5 * 60,
): CallXYZ => {
  const get = getCachedAxiosRequest(logger, cacheMaxAgeSeconds * 1000);
  return (
    notFoundLogLevel: LevelName = 'warn',
    headers = {},
  ) => (url: string) => pipe(
    TE.tryCatch(async () => get<unknown>(url, headers), identity),
    TE.mapLeft(logAndTransformToDataError(logger, url, notFoundLogLevel)),
  );
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import Axios from 'axios';
import { setupCache, type HeaderInterpreter, AxiosCacheInstance } from 'axios-cache-interceptor';
import { logAndTransformToDataError } from './log-and-transform-to-data-error';
import { Logger } from '../shared-ports';
import { LevelName } from '../infrastructure/logger';
import { QueryExternalService } from './query-external-service';

const headerInterpreterWithFixedMaxAge = (maxAge: number): HeaderInterpreter => () => maxAge;

const createCacheAdapter = (maxAge: number) => setupCache(
  Axios.create(),
  { headerInterpreter: headerInterpreterWithFixedMaxAge(maxAge) },
);

const cachedGetter = (
  cachedAxios: AxiosCacheInstance,
  logger: Logger,
  shouldCacheResponseBody: ShouldCacheResponseBody,
) => async <U>(url: string, headers: Record<string, string> = {}): Promise<U> => {
  const startTime = new Date();
  const response = await cachedAxios.get<U>(url, {
    headers: {
      ...headers,
      'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
    },
    timeout: 10 * 1000,
    cache: {
      cachePredicate: {
        // Only cache if the response comes with a "good" status code
        statusCheck: (status) => [
          200, 203, 300, 301, 302, 404, 405, 410, 414, 501,
        ].includes(status), // some calculation

        // Check custom response body
        responseMatch: ({ data }) => shouldCacheResponseBody(data, url),

      },
    },
  });
  if (response.cached) {
    logger('debug', 'Axios cache hit', { url });
  } else {
    logger('debug', 'Axios cache miss', { url });
    const durationInMs = new Date().getTime() - startTime.getTime();
    logger('debug', 'Response time', { url, durationInMs, responseStatus: response.status });
  }
  return response.data;
};

export type ShouldCacheResponseBody = (responseBody: unknown, url: string) => boolean;

type CachingFetcherFactory = (
  logger: Logger,
  cacheMaxAgeSeconds: number,
  shouldCacheResponseBody?: ShouldCacheResponseBody,
) => QueryExternalService;

export const createCachingFetcher: CachingFetcherFactory = (logger, cacheMaxAgeSeconds, shouldCacheResponseBody) => {
  const cachedAxios = createCacheAdapter(cacheMaxAgeSeconds * 1000);
  const get = cachedGetter(cachedAxios, logger, shouldCacheResponseBody ?? (() => true));
  return (
    notFoundLogLevel: LevelName = 'warn',
    headers = {},
  ) => (url: string) => pipe(
    TE.tryCatch(async () => get<unknown>(url, headers), identity),
    TE.mapLeft((error) => {
      logger('debug', 'Axios cache miss', { url });
      return error;
    }),
    TE.mapLeft(logAndTransformToDataError(logger, new URL(url), notFoundLogLevel)),
  );
};

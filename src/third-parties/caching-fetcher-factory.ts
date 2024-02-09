/* eslint-disable @typescript-eslint/no-unused-vars */
import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import Axios from 'axios';
import {
  setupCache,
  AxiosCacheInstance,
  CacheAxiosResponse,
  CacheOptions,
  HeaderInterpreter,
  StorageValue,
  buildMemoryStorage,
  buildStorage,
} from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { logAndTransformToDataError } from './log-and-transform-to-data-error';
import { Logger } from '../shared-ports';
import { LevelName } from '../infrastructure/logger';
import { QueryExternalService } from './query-external-service';

const shouldCacheAccordingToStatusCode = (status: number) => [
  200, 203, 300, 301, 302, 404, 405, 410, 414, 501,
].includes(status);

const constructHeadersWithUserAgent = (headers: Record<string, string> = {}) => ({
  ...headers,
  'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
});

const logResponseTime = (logger: Logger, startTime: Date, response: CacheAxiosResponse | undefined, url: string) => {
  const durationInMs = new Date().getTime() - startTime.getTime();
  logger('debug', 'Response time', { url, durationInMs, responseStatus: response ? response.status : undefined });
};

const cachedGetter = (
  cachedAxios: AxiosCacheInstance,
  logger: Logger,
  responseBodyCachePredicate: ResponseBodyCachePredicate,
) => async <U>(url: string, headers: Record<string, string> = {}): Promise<U> => {
  const startTime = new Date();
  const cacheLoggingPayload = { url };
  let response: CacheAxiosResponse<U> | undefined;
  try {
    response = await cachedAxios.get<U>(url, {
      headers: constructHeadersWithUserAgent(headers),
      timeout: 10 * 1000,
      cache: {
        cachePredicate: {
          statusCheck: shouldCacheAccordingToStatusCode,
          responseMatch: ({ data }) => responseBodyCachePredicate(data, url),
        },
      },
    });
    if (response.cached) {
      logger('debug', 'Axios cache hit', cacheLoggingPayload);
    } else {
      logger('debug', 'Axios cache miss', cacheLoggingPayload);
    }
    return response.data;
  } catch (error: unknown) {
    logger('debug', 'Axios cache miss', cacheLoggingPayload);
    throw error;
  } finally {
    logResponseTime(logger, startTime, response, url);
  }
};

export type ResponseBodyCachePredicate = (responseBody: unknown, url: string) => boolean;

const headerInterpreterWithFixedMaxAge = (maxAge: number): HeaderInterpreter => () => maxAge;

const redisStorage = (
  logger: Logger,
) => (client: ReturnType<typeof createClient>, maxAgeInMilliseconds: number) => buildStorage({
  async find(key, cacheRequestConfig) {
    const storageValue = await client
      .get(`axios-cache-${key}`)
      .then((result) => (result ? (JSON.parse(result) as StorageValue) : undefined));
    if (storageValue !== undefined) {
      logger('debug', 'Found key in the cache', { key });
    }
    return storageValue;
  },

  async set(key, value, cacheRequestConfig) {
    await client.set(`axios-cache-${key}`, JSON.stringify(value), {
      PX: maxAgeInMilliseconds,
    });
  },

  async remove(key) {
    await client.del(`axios-cache-${key}`);
  },
});

const createCacheAdapter = (cachingFetcherOptions: CachingFetcherOptions, logger: Logger) => {
  let cacheOptions: CacheOptions;
  switch (cachingFetcherOptions.tag) {
    case 'redis':
      cacheOptions = {
        headerInterpreter: headerInterpreterWithFixedMaxAge(cachingFetcherOptions.maxAgeInMilliseconds),
        storage: redisStorage(logger)(cachingFetcherOptions.client, cachingFetcherOptions.maxAgeInMilliseconds),
      };
      break;
    case 'local-memory':
      cacheOptions = {
        headerInterpreter: headerInterpreterWithFixedMaxAge(cachingFetcherOptions.maxAgeInMilliseconds),
        storage: buildMemoryStorage(),
      };
      break;
  }
  return setupCache(
    Axios.create(),
    cacheOptions,
  );
};

export type CachingFetcherOptions = {
  tag: 'local-memory',
  maxAgeInMilliseconds: number,
  responseBodyCachePredicate?: ResponseBodyCachePredicate,
} | {
  tag: 'redis',
  maxAgeInMilliseconds: number,
  client: ReturnType<typeof createClient>,
  responseBodyCachePredicate?: ResponseBodyCachePredicate,
};

export const createCachingFetcher = (
  logger: Logger,
  cachingFetcherOptions: CachingFetcherOptions,
): QueryExternalService => {
  const cachedAxios = createCacheAdapter(cachingFetcherOptions, logger);
  const get = cachedGetter(cachedAxios, logger, cachingFetcherOptions.responseBodyCachePredicate ?? (() => true));
  return (
    notFoundLogLevel: LevelName = 'warn',
    headers = {},
  ) => (url: string) => pipe(
    TE.tryCatch(async () => get<unknown>(url, headers), identity),
    TE.mapLeft(logAndTransformToDataError(logger, new URL(url), notFoundLogLevel)),
  );
};

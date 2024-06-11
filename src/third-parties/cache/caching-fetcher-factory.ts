import { URL } from 'url';
import Axios from 'axios';
import {
  setupCache,
  CacheOptions,
  HeaderInterpreter,
  buildMemoryStorage,
} from 'axios-cache-interceptor';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import { createClient } from 'redis';
import { cachedGetter, ResponseBodyCachePredicate } from './cached-getter';
import { generateUrlBasedKey } from './generate-url-based-key';
import { redisStorage } from './redis-storage';
import { LogLevel, Logger } from '../../logger';
import { logAndTransformToDataError } from '../log-and-transform-to-data-error';
import { QueryExternalService } from '../query-external-service';

const headerInterpreterWithFixedMaxAge = (maxAge: number): HeaderInterpreter => () => maxAge;

const selectCacheStorage = (options: CachingFetcherOptions, logger: Logger) => {
  switch (options.tag) {
    case 'redis':
      return redisStorage(options.client, options.maxAgeInMilliseconds, logger);
    case 'local-memory':
      return buildMemoryStorage();
  }
};

const createCacheAdapter = (cachingFetcherOptions: CachingFetcherOptions, logger: Logger) => {
  const cacheOptions: CacheOptions = {
    headerInterpreter: headerInterpreterWithFixedMaxAge(cachingFetcherOptions.maxAgeInMilliseconds),
    generateKey: generateUrlBasedKey(logger),
    storage: selectCacheStorage(cachingFetcherOptions, logger),
  };
  return setupCache(Axios.create({ transitional: { clarifyTimeoutError: true } }), cacheOptions);
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
    notFoundLogLevel: LogLevel = 'warn',
    headers = {},
  ) => (url: string) => pipe(
    TE.tryCatch(async () => get<unknown>(url, headers), identity),
    TE.mapLeft(logAndTransformToDataError(logger, new URL(url), notFoundLogLevel)),
  );
};

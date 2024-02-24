import { URL } from 'url';
import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import Axios from 'axios';
import {
  setupCache,
  CacheOptions,
  HeaderInterpreter,
  buildMemoryStorage,
} from 'axios-cache-interceptor';
import { createClient } from 'redis';
import { logAndTransformToDataError } from '../log-and-transform-to-data-error.js';
import { Logger } from '../../infrastructure/index.js';
import { LevelName } from '../../infrastructure/logger/index.js';
import { QueryExternalService } from '../query-external-service.js';
import { redisStorage } from './redis-storage.js';
import { cachedGetter, ResponseBodyCachePredicate } from './cached-getter.js';
import { generateUrlBasedKey } from './generate-url-based-key.js';

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
    notFoundLogLevel: LevelName = 'warn',
    headers = {},
  ) => (url: string) => pipe(
    TE.tryCatch(async () => get<unknown>(url, headers), identity),
    TE.mapLeft(logAndTransformToDataError(logger, new URL(url), notFoundLogLevel)),
  );
};

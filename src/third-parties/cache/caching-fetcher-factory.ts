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
import { createHash } from 'crypto';
import { logAndTransformToDataError } from '../log-and-transform-to-data-error';
import { Logger } from '../../shared-ports';
import { LevelName } from '../../infrastructure/logger';
import { QueryExternalService } from '../query-external-service';
import { redisStorage } from './redis-storage';
import { cachedGetter, ResponseBodyCachePredicate } from './cached-getter';

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
    generateKey: (input) => {
      const headersHash = createHash('md5').update(JSON.stringify(input.headers)).digest('hex');
      if (input.url === undefined) {
        logger('error', 'Unable to generate a cache key', { input });
        return 'not-reachable-cache-key';
      }
      return `${input.url} ${headersHash}`;
    },
    storage: selectCacheStorage(cachingFetcherOptions, logger),
  };
  return setupCache(Axios.create(), cacheOptions);
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

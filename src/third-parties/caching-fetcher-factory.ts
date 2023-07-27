import * as TE from 'fp-ts/TaskEither';
import { identity, pipe } from 'fp-ts/function';
import Axios from 'axios';
import {
  setupCache, type HeaderInterpreter, AxiosCacheInstance, buildStorage, StorageValue, canStale,
} from 'axios-cache-interceptor';
import { URL } from 'url';
import { createClient } from 'redis';
import { logAndTransformToDataError } from './log-and-transform-to-data-error';
import { Logger } from '../shared-ports';
import { LevelName } from '../infrastructure/logger';
import { QueryExternalService } from './query-external-service';

const headerInterpreterWithFixedMaxAge = (maxAge: number): HeaderInterpreter => () => maxAge;

const redisStorage = (client: ReturnType<typeof createClient>) => buildStorage({
  async find(key) {
    return client
      .get(`axios-cache-${key}`)
      .then((result) => (result ? (JSON.parse(result) as StorageValue) : undefined));
  },

  async set(key, value, req) {
    await client.set(`axios-cache-${key}`, JSON.stringify(value), {
      PXAT:
        // eslint-disable-next-line no-nested-ternary
        value.state === 'loading'
          ? Date.now()
            + (req?.cache && typeof req.cache.ttl === 'number'
              ? req.cache.ttl
              : 60000)
          : (value.state === 'stale' && value.ttl)
            || (value.state === 'cached' && !canStale(value))
            ? value.createdAt + value.ttl!
            : undefined,
    });
  },

  async remove(key) {
    await client.del(`axios-cache-${key}`);
  },
});

const createCacheAdapter = (maxAge: number, client: ReturnType<typeof createClient>) => setupCache(
  Axios.create(),
  {
    headerInterpreter: headerInterpreterWithFixedMaxAge(maxAge),
    storage: redisStorage(client),
  },
);

const cachedGetter = (
  cachedAxios: AxiosCacheInstance,
  logger: Logger,
) => async <U>(url: string, headers: Record<string, string> = {}): Promise<U> => {
  const startTime = new Date();
  const response = await cachedAxios.get<U>(url, {
    headers: {
      ...headers,
      'User-Agent': 'Sciety (http://sciety.org; mailto:team@sciety.org)',
    },
    timeout: 10 * 1000,
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

type CachingFetcherFactory = (logger: Logger, cacheMaxAgeSeconds: number, redisClient: ReturnType<typeof createClient>)
=> QueryExternalService;

export const createCachingFetcher: CachingFetcherFactory = (logger, cacheMaxAgeSeconds, redisClient) => {
  const cachedAxios = createCacheAdapter(cacheMaxAgeSeconds * 1000, redisClient);
  const get = cachedGetter(cachedAxios, logger);
  return (
    notFoundLogLevel: LevelName = 'warn',
    headers = {},
  ) => (url: string) => pipe(
    TE.tryCatch(async () => get<unknown>(url, headers), identity),
    TE.mapLeft(logAndTransformToDataError(logger, new URL(url), notFoundLogLevel)),
  );
};

import axios, { AxiosInstance } from 'axios';
import { RedisStore, setupCache } from 'axios-cache-adapter';
import * as t from 'io-ts';
import redis from 'redis';
import { Logger } from './logger';

export const CacheStrategyCodec = t.keyof({
  redis: null,
  memory: null,
});

type CacheStrategy = t.TypeOf<typeof CacheStrategyCodec>;

const createCacheAdapter = (cacheStrategy: CacheStrategy, maxAge: number) => {
  let store;
  if (cacheStrategy === 'redis') {
    const client = redis.createClient({
      host: 'sciety_cache',
    });
    store = new RedisStore(client);
  }
  const cache = setupCache({
    maxAge,
    store,
  });
  return cache.adapter;
};

const createGetData = (
  cachedAxios: AxiosInstance,
  logger: Logger,
) => async <U>(url: string, headers: Record<string, string> = {}): Promise<U> => {
  const startTime = new Date();
  const response = await cachedAxios.get<U>(url, { headers });
  if (response.request.fromCache) {
    logger('debug', 'Axios cache hit', {
      url,
    });
  } else {
    logger('debug', 'Axios cache miss', {
      url,
    });
    const durationInMs = new Date().getTime() - startTime.getTime();
    logger('debug', 'Response time', { url, durationInMs, responseStatus: response.status });
  }
  return response.data;
};

type GetCachedAxiosRequest = (logger: Logger, cacheStrategy: CacheStrategy, maxAge?: number)
=> <U>(url: string, headers?: Record<string, string>)
=> Promise<U>;

export const getCachedAxiosRequest: GetCachedAxiosRequest = (
  logger,
  cacheStrategy,
  maxAge = 24 * 60 * 60 * 1000,
) => {
  const cachedAxios = axios.create({
    adapter: createCacheAdapter(cacheStrategy, maxAge),
  });
  return createGetData(cachedAxios, logger);
};

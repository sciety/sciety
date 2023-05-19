import axios, { AxiosInstance } from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { Logger } from './logger';

const createCacheAdapter = (maxAge: number) => {
  const cache = setupCache({
    maxAge,
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

type GetCachedAxiosRequest = (logger: Logger, maxAge?: number)
=> <U>(url: string, headers?: Record<string, string>)
=> Promise<U>;

export const getCachedAxiosRequest: GetCachedAxiosRequest = (
  logger: Logger,
  maxAge = 24 * 60 * 60 * 1000,
) => {
  const cachedAxios = axios.create({
    adapter: createCacheAdapter(maxAge),
  });
  return createGetData(cachedAxios, logger);
};

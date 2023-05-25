import Axios, { AxiosInstance } from 'axios';
// import { setupCache } from 'axios-cache-adapter';
import { setupCache, type HeaderInterpreter, AxiosCacheInstance } from 'axios-cache-interceptor';
import { Logger } from './logger';

const myHeaderInterpreter = (maxAge: number): HeaderInterpreter => () => maxAge;

const createCacheAdapter = (maxAge: number) => {
  const axiosTtl = setupCache(Axios.create(), { headerInterpreter: myHeaderInterpreter(maxAge) });
  // return cache.adapter;
  return axiosTtl;
};

const createGetData = (
  cachedAxios: AxiosCacheInstance,
  logger: Logger,
) => async <U>(url: string, headers: Record<string, string> = {}): Promise<U> => {
  const startTime = new Date();
  const response = await cachedAxios.get<U>(url, { headers });
  if (response.cached) {
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
  const cachedAxios = createCacheAdapter(maxAge);
  return createGetData(cachedAxios, logger);
};

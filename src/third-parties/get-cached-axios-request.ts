import Axios from 'axios';
import { setupCache, type HeaderInterpreter, AxiosCacheInstance } from 'axios-cache-interceptor';
import { Logger } from '../shared-ports';

const headerInterpreterWithFixedMaxAge = (maxAge: number): HeaderInterpreter => () => maxAge;

const createCacheAdapter = (maxAge: number) => setupCache(
  Axios.create(),
  { headerInterpreter: headerInterpreterWithFixedMaxAge(maxAge) },
);

const createGetData = (
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

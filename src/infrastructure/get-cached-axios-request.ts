import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import { Logger } from './logger';

const cachedAxios = setupCache(Axios.create());

export const getCachedAxiosRequest = (
  logger: Logger,
) => async <U>(url: string, headers: Record<string, string>): Promise<U> => {
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

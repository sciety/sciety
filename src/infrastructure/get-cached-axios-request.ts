import axios from 'axios';
import { setupCache } from 'axios-cache-adapter';
import { Logger } from './logger';

const cache = setupCache({
  maxAge: 24 * 60 * 60 * 1000,
});
const api = axios.create({
  adapter: cache.adapter,
});

export const getCachedAxiosRequest = (
  logger: Logger,
) => async <U>(url: string, headers: Record<string, string>): Promise<U> => {
  const startTime = new Date();
  const response = await api.get<U>(url, { headers });
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

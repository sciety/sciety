import {
  AxiosCacheInstance,
  CacheAxiosResponse,
} from 'axios-cache-interceptor';
import { Logger } from '../../logger';
import { constructHeadersWithUserAgent } from '../construct-headers-with-user-agent';
import { logResponseTime } from '../log-response-time';

const shouldCacheAccordingToStatusCode = (status: number) => [
  200, 203, 300, 301, 302, 404, 405, 410, 414, 501,
].includes(status);

export type ResponseBodyCachePredicate = (responseBody: unknown, url: string) => boolean;

export const cachedGetter = (
  cachedAxios: AxiosCacheInstance,
  logger: Logger,
  responseBodyCachePredicate: ResponseBodyCachePredicate,
) => async <U>(url: string, headers: Record<string, string> = {}): Promise<U> => {
  const startTime = new Date();
  const cacheLoggingPayload = { url };
  let response: CacheAxiosResponse<U> | undefined;
  try {
    response = await cachedAxios.get<U>(url, {
      headers: constructHeadersWithUserAgent(headers),
      timeout: 10 * 1000,
      cache: {
        cachePredicate: {
          statusCheck: shouldCacheAccordingToStatusCode,
          responseMatch: ({ data }) => responseBodyCachePredicate(data, url),
        },
      },
    });
    if (response.cached) {
      logger('debug', 'Axios cache hit', cacheLoggingPayload);
    } else {
      logger('debug', 'Axios cache miss', cacheLoggingPayload);
      logResponseTime(logger, startTime, response, url);
    }
    return response.data;
  } catch (error: unknown) {
    logger('debug', 'Error from cachedAxios.get', cacheLoggingPayload);
    logResponseTime(logger, startTime, response, url);
    throw error;
  }
};

import { Logger } from '../shared-ports';
import { ShouldCacheResponseBody } from './caching-fetcher-factory';

export const shouldCacheCrossrefResponseBody = (logger: Logger): ShouldCacheResponseBody => (responseBody, url) => {
  if (typeof responseBody === 'string') {
    if (responseBody === '') {
      logger('warn', 'Response from Crossref is an empty string, not caching', { responseBody, url });
      return false;
    }
    if (responseBody.includes('unexpected HTTP status: status=503')) {
      logger('warn', 'Response from Crossref is a Crossref error, not caching', { responseBody, url });
      return false;
    }
  }
  logger('debug', 'Response from Crossref is valid, caching', { responseBody, url });
  return true;
};

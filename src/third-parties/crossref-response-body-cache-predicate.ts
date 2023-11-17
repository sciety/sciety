import { Logger } from '../shared-ports/index.js';
import { ResponseBodyCachePredicate } from './caching-fetcher-factory.js';

export const crossrefResponseBodyCachePredicate = (
  logger: Logger,
): ResponseBodyCachePredicate => (responseBody, url) => {
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

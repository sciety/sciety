import { Logger } from '../shared-ports';
import { ResponseBodyCachePredicate } from './caching-fetcher-factory';

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
    if (responseBody.includes('<?xml version="1.0" encoding="UTF-8"?>') && responseBody.includes('<doi_records>')) {
      logger('debug', 'Response from Crossref looks like XML, caching', { responseBody, url });
      return true;
    }
  }
  if (typeof responseBody === 'object') {
    logger('debug', 'Response from Crossref looks like a javascript object, caching', { responseBody, url });
    return true;
  }
  logger('warn', 'Response from Crossref is unrecognised, not caching', { responseBody, url });
  return false;
};

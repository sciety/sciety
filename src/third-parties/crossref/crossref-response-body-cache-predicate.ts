import { Logger } from '../../infrastructure-contract';
import { ResponseBodyCachePredicate } from '../cache';

export const crossrefResponseBodyCachePredicate = (
  logger: Logger,
): ResponseBodyCachePredicate => (responseBody, url) => {
  if (typeof responseBody === 'string') {
    if (responseBody.includes('<?xml version="1.0" encoding="UTF-8"?>')
    && responseBody.includes('<doi_records>')
    && !responseBody.includes('<error>')) {
      logger('debug', 'Response from Crossref looks like XML, caching', { url });
      return true;
    }
  }
  if (typeof responseBody === 'object') {
    logger('debug', 'Response from Crossref looks like a javascript object, caching', { url });
    return true;
  }
  logger('warn', 'Response from Crossref is unrecognised, not caching', { responseBody, url });
  return false;
};

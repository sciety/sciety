import { createHash } from 'crypto';
import { CacheRequestConfig } from 'axios-cache-interceptor';
import { Logger } from '../../logger';

export const generateUrlBasedKey = (logger: Logger) => (input: CacheRequestConfig<unknown, unknown>): string => {
  const headersHash = createHash('md5').update(JSON.stringify(input.headers)).digest('hex');
  if (input.url === undefined) {
    logger('error', 'Unable to generate a cache key', { input });
    return 'not-reachable-cache-key';
  }
  return `${input.url} ${headersHash}`;
};

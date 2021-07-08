import Redis from 'ioredis';
import { Doi } from '../types/doi';
import { Logger } from './logger';

type DownstreamFetcher = (doi: Doi, acceptHeader: string) => Promise<string>;

export const redisCache = (
  redisHost: string,
  downstreamFetcher: DownstreamFetcher,
  logger: Logger,
): DownstreamFetcher => async (doi, acceptHeader) => {
  const redis = new Redis({
    host: redisHost,
  });
  const cached = await redis.get(doi.toString());
  if (cached !== null) {
    logger('debug', 'Redis cache hit', { doi });
    return cached;
  }
  logger('debug', 'Redis cache miss', { doi });
  const fetched = await downstreamFetcher(doi, acceptHeader);
  await redis.set(doi.toString(), fetched);
  return fetched;
};

import Redis from 'ioredis';
import { Doi } from '../types/doi';

type DownstreamFetcher = (doi: Doi, acceptHeader: string) => Promise<string>;

export const redisCache = (
  downstreamFetcher: DownstreamFetcher,
): DownstreamFetcher => async (doi, acceptHeader) => {
  const redis = new Redis({
    host: 'sciety_cache',
  });
  const cached = await redis.get(doi.toString());
  if (cached !== null) {
    return cached;
  }
  const fetched = await downstreamFetcher(doi, acceptHeader);
  await redis.set(doi.toString(), fetched);
  return fetched;
};

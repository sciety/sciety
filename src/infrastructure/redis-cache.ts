import Redis from 'ioredis';
import { Doi } from '../types/doi';

type DownstreamFetcher = (doi: Doi, acceptHeader: string) => Promise<string>;

export const redisCache = (
  redisHost: string,
  downstreamFetcher: DownstreamFetcher,
): DownstreamFetcher => async (doi, acceptHeader) => {
  const redis = new Redis({
    host: redisHost,
  });
  const cached = await redis.get(doi.toString());
  if (cached !== null) {
    return cached;
  }
  const fetched = await downstreamFetcher(doi, acceptHeader);
  await redis.set(doi.toString(), fetched);
  return fetched;
};

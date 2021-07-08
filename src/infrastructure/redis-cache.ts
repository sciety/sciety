import { Doi } from '../types/doi';

type DownstreamFetcher = (doi: Doi, acceptHeader: string) => Promise<string>;

export const redisCache = (
  downstreamFetcher: DownstreamFetcher,
): DownstreamFetcher => async (doi, acceptHeader) => downstreamFetcher(doi, acceptHeader);

import { Json } from 'fp-ts/Json';
import { fetchData } from './fetchers';
import { Logger } from './logger';

export type GetTwitterResponse = (url: string) => Promise<Json>;

export const getTwitterResponse = (
  twitterApiBearerToken: string,
  logger: Logger,
): GetTwitterResponse => async (url) => (
  fetchData(logger)<Json>(url, { Authorization: `Bearer ${twitterApiBearerToken}` })
    .then((response) => response.data)
);

import { Json } from 'fp-ts/Json';
import { getJsonWithHeadersAndDurationLogging } from './fetchers';
import { Logger } from './logger';

export type GetTwitterResponse = (url: string) => Promise<Json>;

export const getTwitterResponse = (
  twitterApiBearerToken: string,
  logger: Logger,
): GetTwitterResponse => async (url) => (
  getJsonWithHeadersAndDurationLogging(logger)(url, { Authorization: `Bearer ${twitterApiBearerToken}` })
    .then((response) => response.data)
);

import axios from 'axios';
import { Json } from 'fp-ts/Json';
import { Logger } from './logger';

export type GetTwitterResponse = (url: string) => Promise<Json>;

export const getTwitterResponse = (twitterApiBearerToken: string, logger: Logger): GetTwitterResponse => (
  async (url) => {
    const startTime = new Date();
    return axios.get<Json>(
      url,
      { headers: { Authorization: `Bearer ${twitterApiBearerToken}` } },
    )
      .then((response) => response.data)
      .finally(() => {
        const durationInMs = new Date().getTime() - startTime.getTime();
        logger('debug', 'Response time to fetch users from Twitter', { url, durationInMs });
      });
  }
);

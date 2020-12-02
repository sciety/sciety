import axios from 'axios';
import { Logger } from './logger';

type TwitterResponse = {
  data?: {
    name: string,
    profile_image_url: string;
    username: string;
  },
  errors?: unknown,
};

export type GetTwitterResponse = (url: string) => Promise<TwitterResponse>;

export default (twitterApiBearerToken: string, logger: Logger): GetTwitterResponse => (
  async (url) => {
    const startTime = new Date();
    const { data } = await axios.get<TwitterResponse>(
      url,
      { headers: { Authorization: `Bearer ${twitterApiBearerToken}` } },
    ).finally(() => {
      const durationInMs = new Date().getTime() - startTime.getTime();
      logger('debug', 'Response time to fetch users from Twitter', { url, durationInMs });
    });
    return data;
  }
);

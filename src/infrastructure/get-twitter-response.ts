import axios from 'axios';
import { Logger } from './logger';
import { Json } from '../types/json';

export type TwitterResponse = {
  data?: {
    name: string,
    profile_image_url: string,
    username: string,
  },
  errors?: unknown,
};

export type GetTwitterResponse = (url: string) => Promise<TwitterResponse>;

export const createGetTwitterResponse = (twitterApiBearerToken: string, logger: Logger): GetTwitterResponse => (
  async (url) => {
    const startTime = new Date();
    return axios.get<Json>(
      url,
      { headers: { Authorization: `Bearer ${twitterApiBearerToken}` } },
    )
      .then((axiosResponse) => axiosResponse.data as TwitterResponse)
      .finally(() => {
        const durationInMs = new Date().getTime() - startTime.getTime();
        logger('debug', 'Response time to fetch users from Twitter', { url, durationInMs });
      });
  }
);

import axios from 'axios';
import { Result } from 'true-myth';
import { Logger } from './logger';
import { UserId } from '../types/user-id';

export type GetTwitterUserDetails = (userId: UserId) => Promise<Result<{
  avatarUrl: string,
}, 'not-found' | 'unavailable'>>;

type TwitterResponse = {
  data: {
    profile_image_url: string;
  },
};

type GetTwitterResponse = (
  url: string,
  oauthBearerTokenValue: string
) => Promise<TwitterResponse>;

export default (logger: Logger): GetTwitterUserDetails => (
  async (userId) => {
    try {
      const getJson: GetTwitterResponse = async (url, oauthBearerTokenValue) => {
        const { data } = await axios.get<TwitterResponse>(
          url,
          { headers: { Authorization: `Bearer ${oauthBearerTokenValue}` } },
        );
        return data;
      };
      const data = await getJson(
        `https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`,
        process.env.TWITTER_API_BEARER_TOKEN ?? '',
      );
      logger('debug', 'Data from Twitter', { data });
      return Result.ok({
        avatarUrl: data.data.profile_image_url,
      });
    } catch (error) {
      logger('warn', 'Request to Twitter API for user details failed', { error });
      if (error.response.status === 404) {
        return Result.err('not-found');
      }
      return Result.err('unavailable');
    }
  }
);

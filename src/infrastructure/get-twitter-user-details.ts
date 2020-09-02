import axios from 'axios';
import { Result } from 'true-myth';
import { Logger } from './logger';
import { UserId } from '../types/user-id';

export type GetTwitterUserDetails = (userId: UserId) => Promise<Result<{
  avatarUrl: string,
}, 'unavailable'>>;

export default (logger: Logger): GetTwitterUserDetails => (
  async (userId) => {
    try {
      const { data } = await axios.get(
        `https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`,
        { headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER_TOKEN ?? ''}` } },
      );
      logger('debug', 'Data from Twitter', { data });
      return Result.ok({
        avatarUrl: data.data.profile_image_url,
      });
    } catch (error) {
      logger('warn', 'Request to Twitter API for user details failed', { error });
      return Result.err('unavailable');
    }
  }
);

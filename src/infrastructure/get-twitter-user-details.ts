import axios from 'axios';
import { Logger } from './logger';
import { UserId } from '../types/user-id';

export type GetTwitterUserDetails = (userId: UserId) => Promise<{
  avatarUrl: string,
}>;

export default (logger: Logger): GetTwitterUserDetails => (
  async (userId) => {
    try {
      await axios.get(
        `https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`,
        { headers: { Authorization: `Bearer ${process.env.TWITTER_API_BEARER_TOKEN ?? ''}` } },
      );
    } catch (error) {
      logger('warn', 'Request to Twitter API for user details failed', { error });
    }
    return {
      avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
    };
  }
);

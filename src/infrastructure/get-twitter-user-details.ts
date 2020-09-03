import { Result } from 'true-myth';
import { GetTwitterResponse } from './get-twitter-response';
import { Logger } from './logger';
import { UserId } from '../types/user-id';

export type GetTwitterUserDetails = (userId: UserId) => Promise<Result<{
  avatarUrl: string,
}, 'not-found' | 'unavailable'>>;

export default (
  getTwitterResponse: GetTwitterResponse,
  logger: Logger,
): GetTwitterUserDetails => (
  async (userId) => {
    try {
      const data = await getTwitterResponse(
        `https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`,
        process.env.TWITTER_API_BEARER_TOKEN ?? '',
      );
      logger('debug', 'Data from Twitter', { data });
      return Result.ok({
        avatarUrl: data.data.profile_image_url,
      });
    } catch (error) {
      logger('warn', 'Request to Twitter API for user details failed', { error });
      if (error.response && error.response.status === 404) {
        return Result.err('not-found');
      }
      return Result.err('unavailable');
    }
  }
);

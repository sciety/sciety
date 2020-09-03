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
      const data = await getTwitterResponse(`https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`);
      if (data.data) {
        logger('debug', 'Data from Twitter', { userId, data });
        return Result.ok({
          avatarUrl: data.data.profile_image_url,
        });
      }
      logger('debug', 'Twitter user not found', { userId, data });
      return Result.err('not-found');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        logger('debug', 'Twitter user not found', { userId, status: error.response.status, data: error.response.data });
        return Result.err('not-found');
      }
      logger('error', 'Request to Twitter API for user details failed', { error, status: error.response?.status, data: error.response?.data });
      return Result.err('unavailable');
    }
  }
);

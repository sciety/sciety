import { Result } from 'true-myth';
import { GetTwitterResponse } from './get-twitter-response';
import isAxiosError from './is-axios-error';
import { Logger, Payload } from './logger';
import { UserId } from '../types/user-id';

export type GetTwitterUserDetails = (userId: UserId) => Promise<Result<{
  avatarUrl: string,
  displayName: string,
  handle: string;
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
          displayName: data.data.name,
          handle: data.data.username,
        });
      }
      logger('debug', 'Twitter user not found', { userId, data });
      return Result.err('not-found');
    } catch (error: unknown) {
      const payload: Payload = { error, userId };

      if (isAxiosError(error) && error.response) {
        payload.status = error.response.status;
        payload.data = error.response.data;

        if (error.response.status === 400) {
          logger('debug', 'Twitter user not found', payload);
          return Result.err('not-found');
        }
      }

      logger('error', 'Request to Twitter API for user details failed', payload);
      return Result.err('unavailable');
    }
  }
);

import { Result } from 'true-myth';
import { GetTwitterResponse, TwitterResponse } from './get-twitter-response';
import isAxiosError from './is-axios-error';
import { Logger, Payload } from './logger';
import { UserId } from '../types/user-id';

type TwitterUserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string;
};

export type GetTwitterUserDetails = (userId: UserId) => Promise<Result<TwitterUserDetails, 'not-found' | 'unavailable'>>;

const handleOk = (
  logger: Logger,
  userId: UserId,
) => async (
  data: TwitterResponse,
): Promise<Result<TwitterUserDetails, 'not-found' | 'unavailable'>> => {
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
};

const handleError = (logger: Logger, userId: UserId) => (error: unknown): Result<never, 'not-found' | 'unavailable'> => {
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
};

export default (
  getTwitterResponse: GetTwitterResponse,
  logger: Logger,
): GetTwitterUserDetails => (
  async (userId) => {
    try {
      const data = await getTwitterResponse(`https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`);
      return handleOk(logger, userId)(data);
    } catch (error: unknown) {
      return handleError(logger, userId)(error);
    }
  }
);

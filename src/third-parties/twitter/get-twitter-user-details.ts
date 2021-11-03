import axios from 'axios';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetTwitterResponse } from './get-twitter-response';
import { Logger, Payload } from '../../infrastructure/logger';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';

type TwitterUserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
};

type TwitterResponse = {
  data?: {
    name: string,
    profile_image_url: string,
    username: string,
  },
  errors?: unknown,
};

export type GetTwitterUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, TwitterUserDetails>;

const handleOk = (
  logger: Logger,
  userId: UserId,
) => (
  data: TwitterResponse,
) => {
  if (data.data) {
    logger('debug', 'Data from Twitter', { userId, data });
    return TE.right({
      avatarUrl: data.data.profile_image_url.replace('_normal.', '_bigger.'),
      displayName: data.data.name,
      handle: data.data.username,
    });
  }
  logger('debug', 'Twitter user not found', { userId, data });
  return TE.left(DE.notFound);
};

const handleError = (logger: Logger, userId: UserId) => (error: unknown) => {
  const payload: Payload = { error, userId };

  if (axios.isAxiosError(error) && error.response) {
    payload.status = error.response.status;
    payload.data = error.response.data;

    if (error.response.status === 400) {
      logger('debug', 'Twitter user not found', payload);
      return DE.notFound;
    }
  }

  logger('error', 'Request to Twitter API for user details failed', payload);
  return DE.unavailable;
};

export const getTwitterUserDetails = (
  getTwitterResponse: GetTwitterResponse,
  logger: Logger,
): GetTwitterUserDetails => (
  (userId) => pipe(
    getTwitterResponse(`https://api.twitter.com/2/users/${userId}?user.fields=profile_image_url`),
    TE.bimap(
      handleError(logger, userId),
      (data) => data as TwitterResponse,
    ),
    TE.chainW(handleOk(logger, userId)),
  )
);

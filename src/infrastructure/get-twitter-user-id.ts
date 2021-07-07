import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetTwitterResponse } from './get-twitter-response';
import * as DE from '../types/data-error';
import { toUserId, UserId } from '../types/user-id';

export type GetTwitterUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

type TwitterResponse = {
  data?: {
    id: string,
    name: string,
    username: string,
  },
  errors?: unknown,
};

export const getTwitterUserId = (getTwitterResponse: GetTwitterResponse): GetTwitterUserId => (handle) => pipe(
  TE.tryCatch(
    async () => getTwitterResponse(`https://api.twitter.com/2/users/by/username/${handle}`),
    () => DE.unavailable,
  ),
  TE.map((json) => (json as TwitterResponse).data?.id ?? ''),
  TE.map(toUserId),
);

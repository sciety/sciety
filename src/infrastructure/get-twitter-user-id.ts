import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetTwitterResponse } from './get-twitter-response';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

export type GetTwitterUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getTwitterUserId = (getTwitterResponse: GetTwitterResponse): GetTwitterUserId => (handle) => pipe(
  handle,
  () => TE.left(DE.unavailable),
);

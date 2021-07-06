import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

export type GetTwitterUserId = (handle: string) => TE.TaskEither<DE.DataError, UserId>;

export const getTwitterUserId: GetTwitterUserId = (handle) => pipe(
  handle,
  () => TE.left(DE.unavailable),
);

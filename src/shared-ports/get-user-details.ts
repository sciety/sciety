import * as TE from 'fp-ts/TaskEither';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
  userId: UserId,
};

// ts-unused-exports:disable-next-line
export type GetUserDetails = (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>;

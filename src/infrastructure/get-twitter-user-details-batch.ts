import * as TE from 'fp-ts/TaskEither';
import { GetTwitterResponse } from './get-twitter-response';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
};

type GetTwitterUserDetailsBatch = (
  getTwitterResponse: GetTwitterResponse
) => (
  userIds: ReadonlyArray<UserId>
) => TE.TaskEither<DE.DataError, ReadonlyArray<UserDetails>>;

// ts-unused-exports:disable-next-line
export const getTwitterUserDetailsBatch: GetTwitterUserDetailsBatch = () => () => TE.right([]);

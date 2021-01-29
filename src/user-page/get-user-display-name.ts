import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserDetails } from './render-header';
import { UserId } from '../types/user-id';

type GetUserDetails = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', UserDetails>;

type GetUserDisplayName = (userId: UserId) => TE.TaskEither<'not-found' | 'unavailable', string>;

// TODO: cache Twitter user details
export const getUserDisplayName = (getUserDetails: GetUserDetails): GetUserDisplayName => (userId) => (
  pipe(
    userId,
    getUserDetails,
    TE.map(({ displayName }) => displayName),
  )
);

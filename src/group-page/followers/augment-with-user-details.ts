import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserCardViewModel } from './render-followers';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';

type UserDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
};

export type Ports = {
  getUserDetails: (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>,
};

export type Follower = {
  userId: UserId,
  listCount: number,
  followedGroupCount: number,
};

export const augmentWithUserDetails = (
  ports: Ports,
) => (
  followers: ReadonlyArray<Follower>,
): TE.TaskEither<DE.DataError, ReadonlyArray<UserCardViewModel>> => pipe(
  followers,
  TE.traverseArray((follower) => pipe(
    follower.userId,
    ports.getUserDetails,
    TE.map((userDetails) => ({
      ...follower,
      ...userDetails,
      link: `/users/${userDetails.handle}`,
      title: userDetails.displayName,
    })),
  )),
);

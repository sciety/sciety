import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserCardViewModel } from './render-followers';
import { GetUser } from '../../../shared-ports';
import * as DE from '../../../types/data-error';
import { UserId } from '../../../types/user-id';

export type Ports = {
  getUser: GetUser,
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
  RA.map((follower) => follower.userId),
  RA.map(ports.getUser),
  RA.compact,
  (userDetailsArray) => pipe(
    followers,
    RA.map((follower) => pipe(
      userDetailsArray,
      RA.findFirst((userDetails) => userDetails.id === follower.userId),
      O.map((userDetails) => ({
        ...follower,
        ...userDetails,
        link: `/users/${userDetails.handle}`,
        title: userDetails.displayName,
      })),
    )),
    RA.compact,
  ),
  TE.right,
);

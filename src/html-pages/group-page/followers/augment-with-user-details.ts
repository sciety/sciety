import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { UserCardViewModel } from './render-followers';
import { GetUser } from '../../../shared-ports';
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
): ReadonlyArray<UserCardViewModel> => pipe(
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
);

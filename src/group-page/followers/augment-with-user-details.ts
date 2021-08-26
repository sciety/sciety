import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { UserCardViewModel } from './render-followers';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';

type UserDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};

export type Ports = {
  getUserDetailsBatch: (userId: ReadonlyArray<UserId>) => TE.TaskEither<DE.DataError, ReadonlyArray<UserDetails>>,
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
  ports.getUserDetailsBatch,
  TE.chainEitherKW(
    E.traverseArray((userDetails) => pipe(
      followers,
      RA.findFirst((follower) => userDetails.userId === follower.userId),
      O.fold(
        () => E.left(DE.unavailable),
        (follower) => E.right(
          {
            ...follower,
            ...userDetails,
            link: `/users/${userDetails.handle}`,
            title: userDetails.displayName,
          },
        ),
      ),
    )),
  ),
);

import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { LookupUser } from '../../../../shared-ports';
import { Follower, UserCardViewModel } from '../view-model';

export type Ports = {
  lookupUser: LookupUser,
};

export const augmentWithUserDetails = (
  ports: Ports,
) => (
  followers: ReadonlyArray<Follower>,
): ReadonlyArray<UserCardViewModel> => pipe(
  followers,
  RA.map((follower) => follower.userId),
  RA.map(ports.lookupUser),
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

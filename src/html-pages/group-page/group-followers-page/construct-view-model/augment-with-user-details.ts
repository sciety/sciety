import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower, UserCardViewModel } from '../view-model.js';
import { Dependencies } from './dependencies.js';

export const augmentWithUserDetails = (
  dependencies: Dependencies,
) => (
  followers: ReadonlyArray<Follower>,
): ReadonlyArray<UserCardViewModel> => pipe(
  followers,
  RA.map((follower) => follower.userId),
  RA.map(dependencies.lookupUser),
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

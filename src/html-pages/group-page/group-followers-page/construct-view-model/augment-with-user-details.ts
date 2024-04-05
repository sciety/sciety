import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { UserCardViewModel } from '../view-model';
import { Follower } from './follower';
import { Dependencies } from './dependencies';
import { constructUserAvatarUrl } from '../../../../read-side';

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
        avatarUrl: constructUserAvatarUrl(userDetails),
        link: `/users/${userDetails.handle}`,
        title: userDetails.displayName,
      })),
    )),
    RA.compact,
  ),
);

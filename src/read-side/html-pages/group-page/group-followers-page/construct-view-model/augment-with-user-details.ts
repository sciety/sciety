import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { Follower } from './follower';
import { constructUserAvatarSrc } from '../../../../../standards/paths';
import { DependenciesForViews } from '../../../../dependencies-for-views';
import { UserCardViewModel } from '../view-model';

export const augmentWithUserDetails = (
  dependencies: DependenciesForViews,
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
        avatarSrc: constructUserAvatarSrc(userDetails),
        link: `/users/${userDetails.handle}`,
        title: userDetails.displayName,
      })),
    )),
    RA.compact,
  ),
);

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../../../types/user-id';
import { DependenciesForViews } from '../../../dependencies-for-views';
import { constructUserAvatarSrc } from '../../../paths';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarSrc: string,
};

type GetUserOwnerInformation = (dependencies: DependenciesForViews) => (userId: UserId) => O.Option<OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (dependencies) => (userId) => pipe(
  userId,
  dependencies.lookupUser,
  O.map((userDetails) => ({
    ownerName: userDetails.displayName,
    ownerHref: `/users/${userDetails.handle}`,
    ownerAvatarSrc: constructUserAvatarSrc(userDetails),
  })),
);

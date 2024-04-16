import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { constructUserAvatarSrc } from '../../../read-side/paths';
import { UserId } from '../../../types/user-id';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarSrc: string,
};

type GetUserOwnerInformation = (dependencies: Dependencies) => (userId: UserId) => O.Option<OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (dependencies) => (userId) => pipe(
  userId,
  dependencies.lookupUser,
  O.map((userDetails) => ({
    ownerName: userDetails.displayName,
    ownerHref: `/users/${userDetails.handle}`,
    ownerAvatarSrc: constructUserAvatarSrc(userDetails),
  })),
);

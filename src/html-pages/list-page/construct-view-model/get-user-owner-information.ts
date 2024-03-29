import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../../types/user-id';
import { Dependencies } from './dependencies';
import { constructUserAvatarUrl } from '../../../read-side';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

type GetUserOwnerInformation = (dependencies: Dependencies) => (userId: UserId) => O.Option<OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (dependencies) => (userId) => pipe(
  userId,
  dependencies.lookupUser,
  O.map((userDetails) => ({
    ownerName: userDetails.displayName,
    ownerHref: `/users/${userDetails.handle}`,
    ownerAvatarPath: constructUserAvatarUrl(userDetails),
  })),
);

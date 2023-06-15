import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { UserId } from '../../../types/user-id';
import { Queries } from '../../../shared-read-models';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

type Ports = {
  lookupUser: Queries['lookupUser'],
};

type GetUserOwnerInformation = (ports: Ports) => (userId: UserId) => O.Option<OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (ports) => (userId) => pipe(
  userId,
  ports.lookupUser,
  O.map((userDetails) => ({
    ownerName: userDetails.displayName,
    ownerHref: `/users/${userDetails.handle}`,
    ownerAvatarPath: userDetails.avatarUrl,
  })),
);

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { LookupUser } from '../../../shared-ports/lookup-user';
import { UserId } from '../../../types/user-id';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

// ts-unused-exports:disable-next-line
export type Ports = {
  lookupUser: LookupUser,
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

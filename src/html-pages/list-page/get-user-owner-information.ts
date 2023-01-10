import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { GetUser } from '../../shared-ports/get-user';
import { UserId } from '../../types/user-id';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

export type Ports = {
  getUser: GetUser,
};

type GetUserOwnerInformation = (ports: Ports) => (userId: UserId) => O.Option<OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (ports) => (userId) => pipe(
  userId,
  ports.getUser,
  O.map((userDetails) => ({
    ownerName: userDetails.displayName,
    ownerHref: `/users/${userDetails.handle}`,
    ownerAvatarPath: userDetails.avatarUrl,
  })),
);

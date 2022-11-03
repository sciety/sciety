import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
};

export type Ports = {
  getUserDetails: (userId: UserId) => TE.TaskEither<DE.DataError, UserDetails>,
};

type GetUserOwnerInformation = (ports: Ports) => (userId: UserId) => TE.TaskEither<DE.DataError, OwnerInfo>;

export const getUserOwnerInformation: GetUserOwnerInformation = (ports) => (userId) => pipe(
  userId,
  ports.getUserDetails,
  TE.map((userDetails) => ({
    ownerName: userDetails.displayName,
    ownerHref: `/users/${userDetails.handle}`,
    ownerAvatarPath: userDetails.avatarUrl,
  })),
);

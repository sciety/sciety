import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { GetUserDetails } from '../shared-ports/get-user-details';
import * as DE from '../types/data-error';
import { UserId } from '../types/user-id';

type OwnerInfo = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

export type Ports = {
  getUserDetails: GetUserDetails,
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

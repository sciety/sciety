import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { GetAllEvents, GetGroup } from '../../../shared-ports';
import { ListOwnerId } from '../../../types/list-owner-id';

export type Ports = GetUserOwnerInformationPorts & {
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
};

type OwnerInformation = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

type GetOwnerInformation = (ports: Ports) => (ownerId: ListOwnerId) => O.Option<OwnerInformation>;

export const getOwnerInformation: GetOwnerInformation = (ports) => (ownerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        ports.getGroup,
        O.map((group) => ({
          ownerName: group.name,
          ownerHref: `/groups/${group.slug}`,
          ownerAvatarPath: group.avatarPath,
        })),
      );
    case 'user-id':
      return pipe(
        ownerId.value,
        getUserOwnerInformation(ports),
      );
  }
};

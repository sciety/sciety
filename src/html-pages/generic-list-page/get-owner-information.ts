import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { GetAllEvents, GetGroup } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { GroupId } from '../../types/group-id';
import { ListOwnerId } from '../../types/list-owner-id';

export type Ports = GetUserOwnerInformationPorts
& {
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
};

const getGroupOwnerInformation = (ports: Ports) => (groupId: GroupId) => pipe(
  ports.getGroup(groupId),
  E.map((group) => ({
    ownerName: group.name,
    ownerHref: `/groups/${group.slug}`,
    ownerAvatarPath: group.avatarPath,
  })),
  TE.fromEither,
);

type OwnerInformation = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
};

type GetOwnerInformation = (ports: Ports) => (ownerId: ListOwnerId)
=> TE.TaskEither<DE.DataError, OwnerInformation>;

export const getOwnerInformation: GetOwnerInformation = (ports) => (ownerId) => pipe(
  ownerId,
  (oId) => {
    switch (oId.tag) {
      case 'group-id':
        return getGroupOwnerInformation(ports)(oId.value);
      case 'user-id':
        return getUserOwnerInformation(ports)(oId.value);
    }
  },
  TE.map((ownerInformation) => ({
    ...ownerInformation,
  })),
);

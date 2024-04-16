import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { getUserOwnerInformation } from './get-user-owner-information';
import { constructGroupPageHref } from '../../../read-side/paths';
import { ListOwnerId } from '../../../types/list-owner-id';

type OwnerInformation = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarSrc: string,
};

type GetOwnerInformation = (dependencies: Dependencies) => (ownerId: ListOwnerId) => O.Option<OwnerInformation>;

export const getOwnerInformation: GetOwnerInformation = (dependencies) => (ownerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        dependencies.getGroup,
        O.map((group) => ({
          ownerName: group.name,
          ownerHref: constructGroupPageHref(group),
          ownerAvatarSrc: group.avatarPath,
        })),
      );
    case 'user-id':
      return pipe(
        ownerId.value,
        getUserOwnerInformation(dependencies),
      );
  }
};

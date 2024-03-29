import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation } from './get-user-owner-information';
import { ListOwnerId } from '../../../types/list-owner-id';
import { Dependencies } from './dependencies';

type OwnerInformation = {
  ownerName: string,
  ownerHref: string,
  ownerAvatarPath: string,
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
          ownerHref: `/groups/${group.slug}`,
          ownerAvatarPath: group.avatarPath,
        })),
      );
    case 'user-id':
      return pipe(
        ownerId.value,
        getUserOwnerInformation(dependencies),
      );
  }
};

import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ListOwnerId } from '../../../../types/list-owner-id';
import { Dependencies } from './dependencies';
import { ViewModel } from '../view-model';

type GetOwnerInformation = (dependencies: Dependencies) => (ownerId: ListOwnerId) => O.Option<ViewModel['ownerName']>;

export const getOwnerName: GetOwnerInformation = (dependencies) => (ownerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        dependencies.getGroup,
        O.map((group) => group.name),
      );
    case 'user-id':
      return pipe(
        ownerId.value,
        dependencies.lookupUser,
        O.map((userDetails) => userDetails.displayName),
      );
  }
};

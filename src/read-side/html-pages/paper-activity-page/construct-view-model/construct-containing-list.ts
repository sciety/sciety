import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../../read-models/lists';
import { ListOwnerId } from '../../../../types/list-owner-id';
import { ViewModel } from '../view-model';

const getListOwnerName = (dependencies: Dependencies) => (ownerId: ListOwnerId) => {
  switch (ownerId.tag) {
    case 'group-id':
      return pipe(
        ownerId.value,
        dependencies.getGroup,
        O.match(
          () => {
            dependencies.logger('error', 'Consistency error in article page: Failed to get list owner', { ownerId });
            return 'A group';
          },
          (group) => group.name,
        ),
      );

    case 'user-id':
      return pipe(
        ownerId.value,
        dependencies.lookupUser,
        O.match(
          () => {
            dependencies.logger('error', 'Consistency error in article page: Failed to get list owner', { ownerId });
            return 'A user';
          },
          (user) => user.handle,
        ),
      );
  }
};

export const constructContainingList = (dependencies: Dependencies) => (list: List): ViewModel['listedIn'][number] => ({
  listId: list.id,
  listName: list.name,
  listOwnerName: getListOwnerName(dependencies)(list.ownerId),
  listHref: `/lists/${list.id}`,
});

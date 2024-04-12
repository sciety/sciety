import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { List } from '../../read-models/lists';
import { ListCardViewModel } from './render-list-card';
import { Logger } from '../../shared-ports';
import { Queries } from '../../read-models';
import { constructUserAvatarSrc } from '../../read-side';

export type Dependencies = Queries & {
  logger: Logger,
};

const getCurator = (dependencies: Dependencies) => (list: List): ListCardViewModel['curator'] => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return O.none;
    case 'user-id':
      return pipe(
        list.ownerId.value,
        dependencies.lookupUser,
        O.match(
          () => {
            dependencies.logger('error', 'Could not find user who owns list', {
              listId: list.id,
              ownerId: list.ownerId,
            });
            return O.none;
          },
          (userDetails) => O.some({
            avatarUrl: constructUserAvatarSrc(userDetails),
            name: userDetails.displayName,
          }),
        ),
      );
  }
};

export const constructListCardViewModelWithCurator = (
  dependencies: Dependencies,
) => (list: List): ListCardViewModel => ({
  listId: list.id,
  articleCount: list.entries.length,
  updatedAt: list.updatedAt,
  title: list.name,
  description: list.description,
  imageUrl: O.none,
  curator: getCurator(dependencies)(list),
});

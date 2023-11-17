import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { List } from '../../types/list.js';
import { ListCardViewModel } from './render-list-card.js';
import { Logger } from '../../shared-ports/index.js';
import { Queries } from '../../read-models/index.js';

export type Dependencies = Queries & {
  logger: Logger,
};

export const degradedAvatarUrl = '/static/images/sciety-logo.jpg';

const getOwnerAvatarUrl = (
  dependencies: Dependencies,
) => (
  list: List,
): string => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return pipe(
        dependencies.getGroup(list.ownerId.value),
        O.match(
          () => {
            dependencies.logger('error', 'Could not find group that owns list', {
              listId: list.id,
              ownerId: list.ownerId,
            });
            return degradedAvatarUrl;
          },
          (group) => (group.avatarPath),
        ),
      );
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
            return degradedAvatarUrl;
          },
          (userDetails) => (userDetails.avatarUrl),
        ),
      );
  }
};

export const constructListCardViewModelWithAvatar = (
  dependencies: Dependencies,
) => (list: List): ListCardViewModel => pipe(
  list,
  getOwnerAvatarUrl(dependencies),
  (ownerAvatarUrl) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    avatarUrl: O.some(ownerAvatarUrl),
  }),
);

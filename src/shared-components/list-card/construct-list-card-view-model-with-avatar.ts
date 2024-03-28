import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { List } from '../../read-models/lists';
import { ListCardViewModel } from './render-list-card';
import { Logger } from '../../shared-ports';
import { Queries } from '../../read-models';
import { constructUserAvatarUrl } from '../../read-side';

export type Dependencies = Queries & {
  logger: Logger,
};

export const degradedAvatarUrl = '/static/images/sciety-logo.jpg';

type OwnerDetails = {
  avatarUrl: string,
  curatedByUser: boolean,
  displayName: string,
};

const getOwnerDetails = (
  dependencies: Dependencies,
) => (
  list: List,
): OwnerDetails => {
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
            return {
              avatarUrl: degradedAvatarUrl,
              curatedByUser: false,
              displayName: 'unused',
            };
          },
          (group) => ({
            avatarUrl: group.avatarPath,
            curatedByUser: false,
            displayName: 'unused',
          }),
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
            return {
              avatarUrl: degradedAvatarUrl,
              curatedByUser: false as boolean,
              displayName: 'unused',
            };
          },
          (userDetails) => ({
            avatarUrl: constructUserAvatarUrl(userDetails),
            curatedByUser: true,
            displayName: userDetails.displayName,
          }),
        ),
      );
  }
};

export const constructListCardViewModelWithAvatar = (
  dependencies: Dependencies,
) => (list: List): ListCardViewModel => pipe(
  list,
  getOwnerDetails(dependencies),
  (ownerDetails) => ({
    listId: list.id,
    articleCount: list.entries.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    avatarUrl: O.some(ownerDetails.avatarUrl),
    curatedByUser: ownerDetails.curatedByUser,
    ownerDisplayName: ownerDetails.displayName,
    imageUrl: O.none,
  }),
);

import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { List } from '../../types/list';
import { ListCardViewModel } from './render-list-card';
import { Logger } from '../../shared-ports';
import { Queries } from '../../shared-read-models';

export type Ports = Queries & {
  logger: Logger,
};

export const degradedAvatarUrl = '/static/images/sciety-logo.jpg';

const getOwnerAvatarUrl = (
  ports: Ports,
) => (
  list: List,
): string => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return pipe(
        ports.getGroup(list.ownerId.value),
        O.match(
          () => {
            ports.logger('error', 'Could not find group that owns list', {
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
        ports.lookupUser,
        O.match(
          () => {
            ports.logger('error', 'Could not find user who owns list', {
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

export const constructListCardViewModelWithAvatar = (ports: Ports) => (list: List): ListCardViewModel => pipe(
  list,
  getOwnerAvatarUrl(ports),
  (ownerAvatarUrl) => ({
    listId: list.id,
    articleCount: list.articleIds.length,
    updatedAt: O.some(list.updatedAt),
    title: list.name,
    description: list.description,
    avatarUrl: O.some(ownerAvatarUrl),
  }),
);

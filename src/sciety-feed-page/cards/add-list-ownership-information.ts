import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderListPageLinkHref } from '../../shared-components/render-list-page-link-href';
import {
  GetAllEvents, GetGroup, GetUser, Logger,
} from '../../shared-ports';
import * as DE from '../../types/data-error';
import { List } from '../../types/list';

export type Ports = {
  getAllEvents: GetAllEvents,
  getUser: GetUser,
  getGroup: GetGroup,
  logger: Logger,
};

type ListWithAddedOwnershipInformation = {
  name: string,
  description: string,
  ownerName: string,
  ownerAvatarUrl: string,
  linkUrl: string,
};

export const addListOwnershipInformation = (
  ports: Ports,
) => (
  list: List,
): TE.TaskEither<DE.DataError, ListWithAddedOwnershipInformation> => {
  switch (list.ownerId.tag) {
    case 'group-id':
      return pipe(
        ports.getGroup(list.ownerId.value),
        TE.fromOption(() => DE.notFound),
        TE.match(
          () => {
            ports.logger('error', 'Could not find group that owns list', {
              listId: list.listId,
              ownerId: list.ownerId,
            });
            return {
              ...list,
              ownerName: 'A group',
              ownerAvatarUrl: '/static/images/sciety-logo.jpg',
              linkUrl: renderListPageLinkHref(list.listId),
            };
          },
          (group) => ({
            ...list,
            ownerName: group.name,
            ownerAvatarUrl: group.avatarPath,
            linkUrl: renderListPageLinkHref(list.listId),
          }),
        ),
        TE.rightTask,
      );
    case 'user-id':
      return pipe(
        list.ownerId.value,
        ports.getUser,
        O.match(
          () => {
            ports.logger('error', 'Could not find user who owns list', {
              listId: list.listId,
              ownerId: list.ownerId,
            });
            return {
              ...list,
              ownerName: 'A user',
              ownerAvatarUrl: '/static/images/sciety-logo.jpg',
              linkUrl: renderListPageLinkHref(list.listId),
            };
          },
          (userDetails) => (
            {
              ...list,
              ownerName: userDetails.handle,
              ownerAvatarUrl: userDetails.avatarUrl,
              linkUrl: renderListPageLinkHref(list.listId),

            }
          ),
        ),
        TE.right,
      );
  }
};

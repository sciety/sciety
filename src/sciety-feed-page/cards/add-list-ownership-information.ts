import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderListPageLinkHref } from '../../shared-components/render-list-page-link-href';
import { GetAllEvents, GetGroup } from '../../shared-ports';
import { GetUserDetails } from '../../shared-ports/get-user-details';
import * as DE from '../../types/data-error';
import { List } from '../../types/list';

export type Ports = {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
  getGroup: GetGroup,
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
        T.of,
        TE.map((group) => ({
          ...list,
          ownerName: group.name,
          ownerAvatarUrl: group.avatarPath,
          linkUrl: `/lists/${list.listId}`,
        })),
      );
    case 'user-id':
      return pipe(
        list.ownerId.value,
        ports.getUserDetails,
        TE.match(
          () => (
            {
              ...list,
              ownerName: 'A user',
              ownerAvatarUrl: '/static/images/sciety-logo.jpg',
              linkUrl: renderListPageLinkHref(list.listId),
            }
          ),
          (userDetails) => (
            {
              ...list,
              ownerName: userDetails.handle,
              ownerAvatarUrl: userDetails.avatarUrl,
              linkUrl: renderListPageLinkHref(list.listId),

            }
          ),
        ),
        TE.rightTask,
      );
  }
};

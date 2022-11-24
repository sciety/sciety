import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderListPageLinkHref } from '../../shared-components/render-list-page-link-href';
import { GetAllEvents } from '../../shared-ports';
import { GetUserDetails } from '../../shared-ports/get-user-details';
import { getGroup } from '../../shared-read-models/groups';
import { List } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';

export type Ports = {
  getAllEvents: GetAllEvents,
  getUserDetails: GetUserDetails,
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
        ports.getAllEvents,
        TE.rightTask,
        TE.chainEitherK(getGroup(list.ownerId.value)),
        TE.map((group) => ({
          ...list,
          ownerName: group.name,
          ownerAvatarUrl: group.avatarPath,
          linkUrl: `/lists/${list.id}`,
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
              linkUrl: renderListPageLinkHref(list.id),
            }
          ),
          (userDetails) => (
            {
              ...list,
              ownerName: userDetails.handle,
              ownerAvatarUrl: userDetails.avatarUrl,
              linkUrl: renderListPageLinkHref(list.id),

            }
          ),
        ),
        TE.rightTask,
      );
  }
};

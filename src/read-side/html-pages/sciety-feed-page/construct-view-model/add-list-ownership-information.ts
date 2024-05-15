import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { List } from '../../../../read-models/lists';
import { constructUserAvatarSrc } from '../../../paths';
import { renderListPageLinkHref } from '../../shared-components/render-list-page-link-href';

type ListWithAddedOwnershipInformation = {
  name: List['name'],
  description: List['description'],
  ownerName: string,
  ownerAvatarSrc: string,
  linkUrl: string,
};

export const addListOwnershipInformation = (
  dependencies: Dependencies,
) => (
  list: List,
): ListWithAddedOwnershipInformation => {
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
              ...list,
              ownerName: 'A group',
              ownerAvatarSrc: '/static/images/sciety-logo.jpg',
              linkUrl: renderListPageLinkHref(list.id),
            };
          },
          (group) => ({
            ...list,
            ownerName: group.name,
            ownerAvatarSrc: group.avatarPath,
            linkUrl: renderListPageLinkHref(list.id),
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
              ...list,
              ownerName: 'A user',
              ownerAvatarSrc: '/static/images/sciety-logo.jpg',
              linkUrl: renderListPageLinkHref(list.id),
            };
          },
          (userDetails) => (
            {
              ...list,
              ownerName: userDetails.handle,
              ownerAvatarSrc: constructUserAvatarSrc(userDetails),
              linkUrl: renderListPageLinkHref(list.id),
            }
          ),
        ),
      );
  }
};

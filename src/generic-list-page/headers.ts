import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { ViewModel } from './header/render-component';
import { DomainEvent } from '../domain-events';
import { getGroup } from '../shared-read-models/groups';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles/select-articles-belonging-to-list';
import { getList } from '../shared-read-models/lists';
import * as DE from '../types/data-error';
import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';
import { UserId } from '../types/user-id';

const getSelectUserOwnerInformation = (userId: UserId) => {
  switch (userId) {
    case '931653361':
      return E.right({
        ownerName: 'David Ashbrook',
        ownerHref: '/users/DavidAshbrook',
        ownerAvatarPath: 'https://pbs.twimg.com/profile_images/1503119472353239040/eJgS9Y1y_normal.jpg',
      });
    case '1238289812307632129':
      return E.right({
        ownerName: 'Ruchika Bajaj',
        ownerHref: '/users/RuchikaBajaj9',
        ownerAvatarPath: 'https://pbs.twimg.com/profile_images/1426490209990975489/tkYaltji_normal.jpg',
      });
    case '1338873008283377664':
      return E.right({
        ownerName: 'accountfortesting',
        ownerHref: '/users/account27775998',
        ownerAvatarPath: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
      });
    default:
      return E.right({
        ownerName: 'Getting owner info is not implemented',
        ownerHref: '/users/not-a-valid-user-id',
        ownerAvatarPath: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png',
      });
  }
};

const getGroupOwnerInformation = (events: ReadonlyArray<DomainEvent>) => (groupId: GroupId) => pipe(
  events,
  getGroup(groupId),
  E.map((group) => ({
    ownerName: group.name,
    ownerHref: `/groups/${group.slug}`,
    ownerAvatarPath: group.avatarPath,
  })),
);

type Headers = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<DE.DataError, ViewModel>;

export const headers: Headers = (listId) => (events) => pipe(
  events,
  getList(listId),
  TE.chainEitherK((partial) => pipe(
    events,
    selectArticlesBelongingToList(listId),
    E.map((articleIds) => ({
      ...partial,
      articleCount: articleIds.length,
    })),
  )),
  TE.chainEitherKW((partial) => pipe(
    partial.ownerId,
    (ownerId) => {
      switch (ownerId.tag) {
        case 'group-id':
          return getGroupOwnerInformation(events)(ownerId.value);
        case 'user-id':
          return getSelectUserOwnerInformation(ownerId.value);
      }
    },
    E.map((ownerInformation) => ({
      ...partial,
      ...ownerInformation,
    })),
  )),
);

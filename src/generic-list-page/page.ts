import { sequenceS } from 'fp-ts/Apply';
import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { articlesList, Ports } from './articles-list/articles-list';
import { renderComponent } from './header/render-component';
import { renderErrorPage, renderPage } from './render-page';
import { DomainEvent } from '../domain-events';
import { getGroup } from '../shared-read-models/groups';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles/select-articles-belonging-to-list';
import { getList } from '../shared-read-models/lists';
import { ListIdFromString } from '../types/codecs/ListIdFromString';
import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
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

const headers = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => pipe(
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

export const paramsCodec = t.type({
  page: tt.withFallback(tt.NumberFromString, 1),
  id: ListIdFromString,
});

type Params = t.TypeOf<typeof paramsCodec>;

export const page = (ports: Ports) => (params: Params): TE.TaskEither<RenderPageError, Page> => pipe(
  {
    header: pipe(
      ports.getAllEvents,
      T.chain(headers(params.id)),
      TE.map(renderComponent),
    ),
    content: articlesList(ports, params.id, params.page),
    title: pipe(
      ports.getAllEvents,
      T.chain(headers(params.id)),
      TE.map((header) => header.name),
    ),
  },
  sequenceS(TE.ApplyPar),
  TE.bimap(renderErrorPage, renderPage),
);

import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports } from './get-user-owner-information';
import { ViewModel } from './header/render-component';
import { DomainEvent } from '../domain-events';
import { getGroup } from '../shared-read-models/groups';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles/select-articles-belonging-to-list';
import { getList } from '../shared-read-models/lists';
import * as DE from '../types/data-error';
import { GroupId } from '../types/group-id';
import { ListId } from '../types/list-id';

const getGroupOwnerInformation = (events: ReadonlyArray<DomainEvent>) => (groupId: GroupId) => pipe(
  events,
  getGroup(groupId),
  E.map((group) => ({
    ownerName: group.name,
    ownerHref: `/groups/${group.slug}`,
    ownerAvatarPath: group.avatarPath,
  })),
  TE.fromEither,
);

type Headers = (ports: Ports, listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const headers: Headers = (ports, listId) => (events) => pipe(
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
  TE.chain((partial) => pipe(
    partial.ownerId,
    (ownerId) => {
      switch (ownerId.tag) {
        case 'group-id':
          return getGroupOwnerInformation(events)(ownerId.value);
        case 'user-id':
          return getUserOwnerInformation(ports)(ownerId.value);
      }
    },
    TE.map((ownerInformation) => ({
      ...partial,
      ...ownerInformation,
    })),
  )),
);

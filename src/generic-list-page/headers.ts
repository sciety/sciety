import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { ViewModel } from './header/render-component';
import { DomainEvent } from '../domain-events';
import { GetAllEvents, SelectArticlesBelongingToList } from '../shared-ports';
import { getGroup } from '../shared-read-models/groups';
import { List } from '../shared-read-models/lists';
import * as DE from '../types/data-error';
import { GroupId } from '../types/group-id';

type Ports = GetUserOwnerInformationPorts
& {
  getAllEvents: GetAllEvents,
  selectArticlesBelongingToList: SelectArticlesBelongingToList,
};

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

type Headers = (ports: Ports) => (list: List)
=> TE.TaskEither<DE.DataError, ViewModel>;

export const headers: Headers = (ports) => (list) => pipe(
  list.id,
  ports.selectArticlesBelongingToList,
  E.map((articleIds) => ({
    ...list,
    articleCount: articleIds.length,
  })),
  T.of,
  TE.chain((partial) => pipe(
    partial.ownerId,
    (ownerId) => {
      switch (ownerId.tag) {
        case 'group-id':
          return pipe(
            ports.getAllEvents,
            T.chain((events) => getGroupOwnerInformation(events)(ownerId.value)),
          );
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

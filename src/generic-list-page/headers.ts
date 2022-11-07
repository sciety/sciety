import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { getUserOwnerInformation, Ports as GetUserOwnerInformationPorts } from './get-user-owner-information';
import { ViewModel } from './header/render-component';
import { DomainEvent } from '../domain-events';
import { GetAllEvents } from '../shared-ports';
import { getGroup } from '../shared-read-models/groups';
import { selectArticlesBelongingToList } from '../shared-read-models/list-articles/select-articles-belonging-to-list';
import { List } from '../shared-read-models/lists';
import * as DE from '../types/data-error';
import { GroupId } from '../types/group-id';

type Ports = GetUserOwnerInformationPorts & { getAllEvents: GetAllEvents };

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
  list,
  TE.right,
  TE.chain((partial) => pipe(
    ports.getAllEvents,
    T.map(flow(
      selectArticlesBelongingToList(list.id),
      E.map((articleIds) => ({
        ...partial,
        articleCount: articleIds.length,
      })),
    )),
  )),
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

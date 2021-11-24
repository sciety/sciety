import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderComponent } from './render-component';
import { DomainEvent } from '../../domain-events';
import { allLists, Ports as GroupListPorts, List } from '../../shared-read-models/all-lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = GroupListPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const augmentWithOwnerDetails = (ports: Ports) => (list: List) => pipe(
  list.ownerId,
  ports.getGroup,
  TE.map((group) => ({
    ...list,
    ownerName: group.name,
    ownerAvatarPath: group.avatarPath,
    ownerHref: `/groups/${group.slug}`,
  })),
);

export const component = (
  ports: Ports,
  group: Group,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(allLists(ports, group.id)),
  TE.chain(augmentWithOwnerDetails(ports)),
  TE.map(renderComponent),
);

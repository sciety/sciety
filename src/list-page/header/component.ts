import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderComponent } from './render-component';
import { DomainEvent } from '../../domain-events';
import { getGroup } from '../../shared-read-models/all-groups';
import { List, selectAllListsOwnedBy } from '../../shared-read-models/lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const augmentWithOwnerDetails = (ports: Ports) => (list: List) => pipe(
  ports.getAllEvents,
  T.map(getGroup(list.ownerId)),
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
  TE.map(selectAllListsOwnedBy(group.id)),
  // this should be looking up by list id, not by group id, as it doesn't support
  // multiple lists for a given group
  TE.map((lists) => lists[0]),
  TE.chain(augmentWithOwnerDetails(ports)),
  TE.map(renderComponent),
);

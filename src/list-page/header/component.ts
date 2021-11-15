import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderComponent } from './render-component';
import { DomainEvent } from '../../domain-events';
import { defaultGroupListDescription } from '../../group-page/messages';
import { groupList, Ports as GroupListPorts } from '../../shared-read-models/group-list';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = GroupListPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const component = (
  ports: Ports,
  group: Group,
): TE.TaskEither<never, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(groupList(ports, group.id)),
  TE.map((groupListResult) => ({
    ...groupListResult,
    description: defaultGroupListDescription(group.name),
    ownerName: group.name,
    ownerHref: `/groups/${group.slug}`,
    ownerAvatarPath: group.avatarPath,
  })),
  TE.map(renderComponent),
);

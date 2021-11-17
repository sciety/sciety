import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { renderComponent } from './render-component';
import { DomainEvent } from '../../domain-events';
import { allLists, Ports as GroupListPorts } from '../../shared-read-models/all-lists';
import * as DE from '../../types/data-error';
import { Group } from '../../types/group';
import { HtmlFragment } from '../../types/html-fragment';

export type Ports = GroupListPorts & {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

export const component = (
  ports: Ports,
  group: Group,
): TE.TaskEither<DE.DataError, HtmlFragment> => pipe(
  ports.getAllEvents,
  TE.rightTask,
  TE.chain(allLists(ports, group.id)),
  TE.map(renderComponent),
);

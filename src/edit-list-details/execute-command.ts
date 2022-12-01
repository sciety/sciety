import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { EditListDetailsCommand } from '../commands';
import { DomainEvent, listDescriptionEdited } from '../domain-events';
import { listNameEdited } from '../domain-events/list-name-edited-event';
import { ListResource } from '../shared-write-models/list-resource';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listResource: ListResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (listResource) => pipe(
  listResource,
  ({ name }) => name === command.name,
  B.fold(
    () => [listNameEdited(command.listId, command.name)],
    () => [],
  ),
  (eventsRaisedSoFar) => ((listResource.description === command.description)
    ? eventsRaisedSoFar
    : [...eventsRaisedSoFar, listDescriptionEdited(command.listId, command.description)]),
);

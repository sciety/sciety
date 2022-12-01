import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { EditListDetailsCommand } from '../commands';
import { DomainEvent, listDescriptionEdited } from '../domain-events';
import { listNameEdited } from '../domain-events/list-name-edited-event';
import { ListResource } from '../shared-write-models/list-resource';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listAggregate: ListResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (listAggregate) => pipe(
  listAggregate,
  ({ name }) => name === command.name,
  B.fold(
    () => [listNameEdited(command.listId, command.name)],
    () => [],
  ),
  (eventsRaisedSoFar) => ((listAggregate.description === command.description)
    ? eventsRaisedSoFar
    : [...eventsRaisedSoFar, listDescriptionEdited(command.listId, command.description)]),
);

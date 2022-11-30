import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { EditListDetailsCommand } from '../commands';
import { DomainEvent } from '../domain-events';
import { listNameEdited } from '../domain-events/list-name-edited-event';
import { ListResource } from '../shared-write-models/list-resource';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listAggregate: ListResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (listAggregate) => pipe(
  listAggregate.name,
  (listName) => listName === command.name,
  B.fold(
    () => [listNameEdited(command.listId, command.name)],
    () => [],
  ),
);

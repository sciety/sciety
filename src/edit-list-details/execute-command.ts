import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { EditListDetailsCommand } from '../commands';
import { DomainEvent } from '../domain-events';
import { listNameEdited } from '../domain-events/list-name-edited-event';
import { ListAggregate } from '../shared-write-models/list-aggregate';

type ExecuteCommand = (command: EditListDetailsCommand)
=> (listAggregate: ListAggregate)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (listAggregate) => pipe(
  listAggregate.name,
  (listName) => listName === command.name,
  B.fold(
    () => [listNameEdited(command.listId, command.name)],
    () => [],
  ),
);

import { pipe } from 'fp-ts/function';
import { replayAllLists } from '../resources/all-lists';
import { CreateListCommand } from '../commands';
import { DomainEvent, listCreated, ListCreatedEvent } from '../../domain-events';

type ExecuteCreateListCommand = (command: CreateListCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => (events) => pipe(
  events,
  replayAllLists,
  (resource) => (resource.includes(command.listId)
    ? []
    : [listCreated(
      command.listId,
      command.name,
      command.description,
      command.ownerId,
    )]),
);

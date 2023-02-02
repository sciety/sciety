import { AllListsResource } from '../resources/all-lists';
import { CreateListCommand } from '../commands';
import { listCreated, ListCreatedEvent } from '../../domain-events';

type ExecuteCreateListCommand = (command: CreateListCommand)
=> (resource: AllListsResource)
=> ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => (resource) => (
  resource.includes(command.listId)
    ? []
    : [listCreated(
      command.listId,
      command.name,
      command.description,
      command.ownerId,
    )]
);

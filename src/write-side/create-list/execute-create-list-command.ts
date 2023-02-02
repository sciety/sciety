import { CreateListCommand } from '../commands';
import { listCreated, ListCreatedEvent } from '../../domain-events';
import { AllListsResource } from '../resources/all-lists';

type ExecuteCreateListCommand = (command: CreateListCommand)
=> (resource: AllListsResource)
=> ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => () => [listCreated(
  command.listId,
  command.name,
  command.description,
  command.ownerId,
)];

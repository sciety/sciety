import { CreateListCommand } from '../commands';
import { listCreated, ListCreatedEvent } from '../../domain-events';
import { AllListsResource } from '../resources/all-lists';

type ExecuteCreateListCommand = (resource: AllListsResource)
=> (command: CreateListCommand)
=> ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = () => (command) => [listCreated(
  command.listId,
  command.name,
  command.description,
  command.ownerId,
)];

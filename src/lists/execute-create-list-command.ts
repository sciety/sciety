import { CreateListCommand } from '../write-side/commands';
import { listCreated, ListCreatedEvent } from '../domain-events';

type ExecuteCreateListCommand = (command: CreateListCommand) => ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => [listCreated(
  command.listId,
  command.name,
  command.description,
  command.ownerId,
)];

import { CreateListCommand } from '../write-side/commands';
import { listCreated, ListCreatedEvent } from '../domain-events';
import { ListId } from '../types/list-id';

type ListsResource = ReadonlyArray<ListId>;

type ExecuteCreateListCommand = (resource: ListsResource)
=> (command: CreateListCommand)
=> ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = () => (command) => [listCreated(
  command.listId,
  command.name,
  command.description,
  command.ownerId,
)];

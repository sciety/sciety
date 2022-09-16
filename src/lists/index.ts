import { v4 } from 'uuid';
import { CreateListCommand } from '../commands';
import { listCreated, ListCreatedEvent } from '../domain-events';
import * as LID from '../types/list-id';

type ExecuteCreateListCommand = (command: CreateListCommand) => ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => [listCreated(
  LID.fromValidatedString(v4()),
  command.name,
  command.description,
  command.ownerId,
)];

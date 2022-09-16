import { v4 } from 'uuid';
import { listCreated, ListCreatedEvent } from '../domain-events';
import * as LID from '../types/list-id';
import * as LOID from '../types/list-owner-id';

type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
  name: string,
  description: string,
};

type ExecuteCreateListCommand = (command: CreateListCommand) => ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = (command) => [listCreated(
  LID.fromValidatedString(v4()),
  command.name,
  command.description,
  command.ownerId,
)];

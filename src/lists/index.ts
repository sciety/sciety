import { ListCreatedEvent } from '../domain-events';
import * as LOID from '../types/list-owner-id';

type CreateListCommand = {
  ownerId: LOID.ListOwnerId,
  name: string,
  description: string,
};

type ExecuteCreateListCommand = (command: CreateListCommand) => ReadonlyArray<ListCreatedEvent>;

export const executeCreateListCommand: ExecuteCreateListCommand = () => [];

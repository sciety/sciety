import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { v4 } from 'uuid';
import { CreateListCommand } from '../commands';
import { listCreated, ListCreatedEvent } from '../domain-events';
import { CommitEvents, CreateList } from '../shared-ports';
import * as LID from '../types/list-id';

type ExecuteCreateListCommand = (command: CreateListCommand) => ReadonlyArray<ListCreatedEvent>;

// ts-unused-exports:disable-next-line
export const executeCreateListCommand: ExecuteCreateListCommand = (command) => [listCreated(
  LID.fromValidatedString(v4()),
  command.name,
  command.description,
  command.ownerId,
)];

type Ports = {
  commitEvents: CommitEvents,
};

export const createListCommandHandler = (ports: Ports): CreateList => (command) => pipe(
  command,
  executeCreateListCommand,
  ports.commitEvents,
  TE.rightTask,
  TE.map(() => undefined),
);

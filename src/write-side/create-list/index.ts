import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCreateListCommand } from './execute-create-list-command';
import { CommitEvents, CreateList } from '../../shared-ports';

type Ports = {
  commitEvents: CommitEvents,
};

export const createListCommandHandler = (ports: Ports): CreateList => (command) => pipe(
  command,
  executeCreateListCommand([]),
  ports.commitEvents,
  TE.rightTask,
);

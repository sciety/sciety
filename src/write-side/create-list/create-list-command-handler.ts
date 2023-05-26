import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { executeCreateListCommand } from './execute-create-list-command';
import { CommitEvents, CreateList, GetAllEvents } from '../../shared-ports';

type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const createListCommandHandler = (ports: Ports): CreateList => (command) => pipe(
  ports.getAllEvents,
  T.map(executeCreateListCommand(command)),
  T.chain(ports.commitEvents),
  TE.rightTask,
);

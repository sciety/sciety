import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { executeCreateListCommand } from './execute-create-list-command';
import { CreateList, GetAllEvents } from '../../shared-ports';
import { replayAllLists } from '../resources/all-lists';
import { ConcurrencySafeCommitEvents } from '../../shared-ports/concurrency-safe-commit-events';

type Ports = {
  concurrencySafeCommitEvents: ConcurrencySafeCommitEvents,
  getAllEvents: GetAllEvents,
};

export const createListCommandHandler = (ports: Ports): CreateList => (command) => pipe(
  ports.getAllEvents,
  T.map(replayAllLists),
  T.map(executeCreateListCommand(command)),
  T.chain(ports.concurrencySafeCommitEvents),
  TE.rightTask,
);

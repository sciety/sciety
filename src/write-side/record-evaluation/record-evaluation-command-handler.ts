import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { RecordEvaluationCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { ErrorMessage } from '../../types/error-message';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RecordEvaluationCommandHandler = (ports: Ports)
=> (command: RecordEvaluationCommand)
=> TE.TaskEither<ErrorMessage, CommandResult>;

export const recordEvaluationCommandHandler: RecordEvaluationCommandHandler = (ports) => (command) => pipe(
  ports.getAllEvents,
  T.map(executeCommand(command)),
  T.chain(ports.commitEvents),
  TE.rightTask,
);

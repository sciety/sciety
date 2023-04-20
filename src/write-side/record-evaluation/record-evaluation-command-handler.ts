import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { RecordEvaluationCommand } from '../commands';
import { CommitEvents, GetAllEvents, GetGroup } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  getGroup: GetGroup,
};

const confirmGroupExists = (ports: Ports) => (command: RecordEvaluationCommand) => pipe(
  command.groupId,
  ports.getGroup,
  E.fromOption(() => toErrorMessage(`Group "${command.groupId}" not found`)),
);

type RecordEvaluationCommandHandler = (ports: Ports)
=> (command: RecordEvaluationCommand)
=> TE.TaskEither<ErrorMessage, CommandResult>;

export const recordEvaluationCommandHandler: RecordEvaluationCommandHandler = (ports) => (command) => pipe(
  command,
  confirmGroupExists(ports),
  TE.fromEither,
  TE.chainTaskK(() => pipe(
    ports.getAllEvents,
    T.map(executeCommand(command)),
  )),
  TE.chainTaskK(ports.commitEvents),
);

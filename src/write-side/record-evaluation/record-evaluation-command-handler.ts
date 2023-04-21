import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { RecordEvaluationCommand } from '../commands';
import { CommitEvents, GetAllEvents, GetGroup } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { ErrorMessage } from '../../types/error-message';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  getGroup: GetGroup,
};

type RecordEvaluationCommandHandler = (ports: Ports)
=> (command: RecordEvaluationCommand)
=> TE.TaskEither<ErrorMessage, CommandResult>;

export const recordEvaluationCommandHandler: RecordEvaluationCommandHandler = (ports) => (command) => pipe(
  command,
  TE.right,
  TE.chainTaskK(() => pipe(
    ports.getAllEvents,
    T.map(executeCommand(command)),
  )),
  TE.chainTaskK(ports.commitEvents),
);

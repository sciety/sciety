import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { executeCommand } from '../record-evaluation/execute-command';
import { RecordEvaluationCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RecordEvaluationCommandHandler = (
  adapters: Ports
) => CommandHandler<RecordEvaluationCommand>;

export const recordEvaluationCommandHandler: RecordEvaluationCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(executeCommand(command)),
  T.chain(adapters.commitEvents),
  TE.rightTask,
);

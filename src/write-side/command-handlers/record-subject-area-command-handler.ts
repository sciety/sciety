import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { executeCommand } from '../record-subject-area/execute-command';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RecordSubjectAreaCommandHandler = (
  ports: Ports
) => CommandHandler<RecordSubjectAreaCommand>;

export const recordSubjectAreaCommandHandler: RecordSubjectAreaCommandHandler = (
  ports,
) => (
  command,
) => pipe(
  ports.getAllEvents,
  T.map(executeCommand(command)),
  TE.chainTaskK(ports.commitEvents),
);

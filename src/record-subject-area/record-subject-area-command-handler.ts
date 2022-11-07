import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { RecordSubjectAreaCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../shared-ports';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RecordSubjectAreaCommandHandler = (
  ports: Ports
) => (
  input: RecordSubjectAreaCommand,
) => TE.TaskEither<string, void>;

export const recordSubjectAreaCommandHandler: RecordSubjectAreaCommandHandler = (
  ports,
) => (
  command,
) => pipe(
  ports.getAllEvents,
  T.map(executeCommand(command)),
  TE.chainTaskK(ports.commitEvents),
  TE.map(() => undefined),
);

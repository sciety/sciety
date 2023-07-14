import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { recordSubjectArea } from '../resources/article';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type RecordSubjectAreaCommandHandler = (
  dependencies: Ports
) => CommandHandler<RecordSubjectAreaCommand>;

export const recordSubjectAreaCommandHandler: RecordSubjectAreaCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(recordSubjectArea(command)),
  TE.chainTaskK(dependencies.commitEvents),
);

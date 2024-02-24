import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../commands';
import { CommandHandler } from './command-handler';
import { recordSubjectArea } from '../resources/article';
import { DependenciesForCommands } from '../dependencies-for-commands';

type RecordSubjectAreaCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<RecordSubjectAreaCommand>;

export const recordSubjectAreaCommandHandler: RecordSubjectAreaCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(recordSubjectArea(command)),
  TE.chainW(dependencies.commitEvents),
);

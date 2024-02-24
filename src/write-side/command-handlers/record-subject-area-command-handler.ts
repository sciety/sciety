import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RecordSubjectAreaCommand } from '../commands/index.js';
import { CommandHandler } from './command-handler.js';
import { recordSubjectArea } from '../resources/article/index.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';

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

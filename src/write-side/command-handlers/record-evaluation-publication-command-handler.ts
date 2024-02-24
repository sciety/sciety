import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from './command-handler.js';
import { recordPublication } from '../resources/evaluation/index.js';
import { RecordEvaluationPublicationCommand } from '../commands/index.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';

type RecordEvaluationPublicationCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<RecordEvaluationPublicationCommand>;

export const recordEvaluationPublicationCommandHandler: RecordEvaluationPublicationCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(recordPublication(command)),
  TE.chainW(dependencies.commitEvents),
);

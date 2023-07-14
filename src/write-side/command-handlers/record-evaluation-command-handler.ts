import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { record } from '../resources/evaluation';
import { RecordEvaluationCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';

type RecordEvaluationCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<RecordEvaluationCommand>;

export const recordEvaluationCommandHandler: RecordEvaluationCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(record(command)),
  TE.chainTaskK(dependencies.commitEvents),
);

import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { RecordSubjectAreaCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { recordSubjectArea } from '../resources/article';

type RecordSubjectAreaCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<RecordSubjectAreaCommand>;

/**
 * @deprecated should be substituted with executeResourceAction
 */
export const recordSubjectAreaCommandHandler: RecordSubjectAreaCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(recordSubjectArea(command)),
  TE.chainW(dependencies.commitEvents),
);

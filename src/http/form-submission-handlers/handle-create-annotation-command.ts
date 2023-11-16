import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as listResource from '../../write-side/resources/list';
import { Logger } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { annotateArticleInListCommandCodec } from '../../write-side/commands';

export type Dependencies = DependenciesForCommands & {
  logger: Logger,
};

type HandleCreateAnnotationCommand = (
  dependencies: Dependencies,
) => (input: unknown) => TE.TaskEither<unknown, CommandResult>;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (dependencies) => (input) => pipe(
  input,
  annotateArticleInListCommandCodec.decode,
  TE.fromEither,
  TE.chainFirstTaskK(
    (command) => T.of(
      dependencies.logger('debug', 'Received CreateAnnotation command', { command }),
    ),
  ),
  TE.chainW((command) => pipe(
    dependencies.getAllEvents,
    T.map(listResource.annotate(command)),
  )),
  TE.chainW(dependencies.commitEvents),
);

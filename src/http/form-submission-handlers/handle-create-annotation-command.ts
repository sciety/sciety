import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Logger } from '../../logger';
import { CommandResult } from '../../types/command-result';
import { DependenciesForCommands } from '../../write-side';
import { annotateArticleInListCommandCodec } from '../../write-side/commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as listResource from '../../write-side/resources/list';

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
  TE.chainW(executeResourceAction(dependencies, listResource.annotate)),
);

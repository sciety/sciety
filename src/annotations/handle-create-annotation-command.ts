import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as listResource from '../write-side/resources/list';
import { Logger } from '../shared-ports';
import { CommandResult } from '../types/command-result';
import { DependenciesForCommands } from '../write-side/dependencies-for-commands';
import { toHtmlFragment } from '../types/html-fragment';
import { CreateAnnotationCommand, createAnnotationCommandCodec } from '../write-side/commands';

type Body = t.TypeOf<typeof createAnnotationCommandCodec>;

const transformToCommand = ({ content, articleId, listId }: Body): CreateAnnotationCommand => ({
  content: toHtmlFragment(content),
  articleId,
  listId,
});

export type Dependencies = DependenciesForCommands & {
  logger: Logger,
};

type HandleCreateAnnotationCommand = (
  dependencies: Dependencies,
) => (input: unknown) => TE.TaskEither<unknown, CommandResult>;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (dependencies) => (input) => pipe(
  input,
  createAnnotationCommandCodec.decode,
  E.map(transformToCommand),
  TE.fromEither,
  TE.chainFirstTaskK(
    (command) => T.of(
      dependencies.logger('debug', 'Received CreateAnnotation command', { command }),
    ),
  ),
  TE.chainW((command) => pipe(
    dependencies.getAllEvents,
    T.map(listResource.createAnnotation(command)),
  )),
  TE.chainTaskK(dependencies.commitEvents),
  TE.map(() => 'no-events-created'),
);

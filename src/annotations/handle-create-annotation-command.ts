import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { CreateAnnotationCommand, executeCreateAnnotationCommand } from './execute-create-annotation-command';
import { Logger } from '../shared-ports';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { CommandResult } from '../types/command-result';
import { Doi } from '../types/doi';
import { HtmlFragment, htmlFragmentCodec } from '../types/html-fragment';
import { fromValidatedString, ListId, listIdCodec } from '../types/list-id';
import { DependenciesForCommands } from '../write-side/dependencies-for-commands';

type Body = {
  annotationContent: HtmlFragment,
  articleId: Doi,
  listId: ListId,
};

const bodyCodec = t.type({
  annotationContent: htmlFragmentCodec,
  articleId: DoiFromString,
  listId: listIdCodec,
});

const transformToCommand = ({ annotationContent, articleId, listId }: Body): CreateAnnotationCommand => ({
  content: annotationContent,
  target: {
    articleId,
    listId: fromValidatedString(listId),
  },
});

type Dependencies = DependenciesForCommands & {
  logger: Logger,
};

type HandleCreateAnnotationCommand = (
  dependencies: Dependencies,
) => (input: unknown) => TE.TaskEither<unknown, CommandResult>;

export const handleCreateAnnotationCommand: HandleCreateAnnotationCommand = (dependencies) => (input) => pipe(
  input,
  bodyCodec.decode,
  E.map(transformToCommand),
  TE.fromEither,
  TE.chainFirstTaskK(
    (command) => T.of(
      dependencies.logger('debug', 'Received CreateAnnotation command', { command }),
    ),
  ),
  TE.chainTaskK((command) => pipe(
    dependencies.getAllEvents,
    T.map(executeCreateAnnotationCommand(command)),
  )),
  TE.chainTaskK(dependencies.commitEvents),
  TE.map(() => 'no-events-created'),
);

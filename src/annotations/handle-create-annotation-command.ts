import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { executeCreateAnnotationCommand } from './execute-create-annotation-command';
import { Logger } from '../shared-ports';
import { DoiFromString } from '../types/codecs/DoiFromString';
import { CommandResult } from '../types/command-result';
import { fromValidatedString, listIdCodec } from '../types/list-id';
import { DependenciesForCommands } from '../write-side/dependencies-for-commands';
import { userGeneratedInputCodec } from '../types/user-generated-input';
import { toHtmlFragment } from '../types/html-fragment';
import { CreateAnnotationCommand } from '../write-side/commands';

export const createAnnotationCommandCodec = t.type({
  annotationContent: userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: false }),
  articleId: DoiFromString,
  listId: listIdCodec,
});

type Body = t.TypeOf<typeof createAnnotationCommandCodec>;

const transformToCommand = ({ annotationContent, articleId, listId }: Body): CreateAnnotationCommand => ({
  content: toHtmlFragment(annotationContent),
  target: {
    articleId,
    listId: fromValidatedString(listId),
  },
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
  TE.chainTaskK((command) => pipe(
    dependencies.getAllEvents,
    T.map(executeCreateAnnotationCommand(command)),
  )),
  TE.chainTaskK(dependencies.commitEvents),
  TE.map(() => 'no-events-created'),
);

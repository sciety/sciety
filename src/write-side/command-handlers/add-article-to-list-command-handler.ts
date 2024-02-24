import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticle } from '../resources/list/index.js';
import { AddArticleToListCommand } from '../commands/index.js';
import { CommandHandler } from './command-handler.js';
import { DependenciesForCommands } from '../dependencies-for-commands.js';

type AddArticleToListCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<AddArticleToListCommand>;

export const addArticleToListCommandHandler: AddArticleToListCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(addArticle(command)),
  TE.chainW(dependencies.commitEvents),
);

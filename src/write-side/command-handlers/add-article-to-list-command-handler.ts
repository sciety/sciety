import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { addArticle } from '../resources/list';
import { AddArticleToListCommand } from '../commands';
import { CommandHandler } from './command-handler';
import { DependenciesForCommands } from '../dependencies-for-commands';

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

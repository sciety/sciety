import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import { removeArticle } from '../resources/list/remove-article';
import { RemoveArticleFromListCommand } from '../commands';
import { CommandHandler } from './command-handler';
import { DependenciesForCommands } from '../dependencies-for-commands';

type RemoveArticleFromListCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<RemoveArticleFromListCommand>;

export const removeArticleFromListCommandHandler: RemoveArticleFromListCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(removeArticle(command)),
  TE.chainW(dependencies.commitEvents),
);

import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { RemoveArticleFromListCommand } from '../commands';
import { DependenciesForCommands } from '../dependencies-for-commands';
import { removeArticle } from '../resources/list/remove-article';

type RemoveArticleFromListCommandHandler = (
  dependencies: DependenciesForCommands
) => CommandHandler<RemoveArticleFromListCommand>;

/**
 * @deprecated should be substituted with executeResourceAction
 */
export const removeArticleFromListCommandHandler: RemoveArticleFromListCommandHandler = (
  dependencies,
) => (
  command,
) => pipe(
  dependencies.getAllEvents,
  T.map(removeArticle(command)),
  TE.chainW(dependencies.commitEvents),
);

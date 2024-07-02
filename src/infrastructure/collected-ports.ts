import { DependenciesForViews } from '../read-side/dependencies-for-views';
import { CommandHandler } from '../types/command-handler';
import { DependenciesForCommands } from '../write-side';
import { AddArticleToListCommand } from '../write-side/commands';

/**
 * @deprecated sagas should use DependenciesForCommands and executeResourceAction instead
 */
type CommandHandlersForSagas = {
  addArticleToList: CommandHandler<AddArticleToListCommand>,
};

export type CollectedPorts = DependenciesForViews & DependenciesForCommands
& CommandHandlersForSagas;

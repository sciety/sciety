import { Logger } from '../logger';
import { Queries } from '../read-models';
import { CommitEvents } from '../shared-ports/commit-events';
import { GetAllEvents } from '../shared-ports/get-all-events';
import { ExternalQueries } from '../third-parties';
import { CommandHandler } from '../types/command-handler';
import { AddArticleToListCommand, CreateListCommand, RecordSubjectAreaCommand } from '../write-side/commands';

type EventStore = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

/**
 * @deprecated sagas should use DependenciesForCommands and executeResourceAction instead
 */
type CommandHandlersForSagas = {
  addArticleToList: CommandHandler<AddArticleToListCommand>,
  createList: CommandHandler<CreateListCommand>,
  recordSubjectArea: CommandHandler<RecordSubjectAreaCommand>,
};

export type CollectedPorts = Queries
& ExternalQueries
& EventStore
& CommandHandlersForSagas
& {
  logger: Logger,
};

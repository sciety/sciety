import { Logger } from '../logger';
import { CommitEvents } from '../shared-ports/commit-events';
import { GetAllEvents } from '../shared-ports/get-all-events';

export type DependenciesForCommands = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  logger: Logger,
};

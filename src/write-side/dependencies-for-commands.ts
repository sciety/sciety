import { CommitEvents } from '../event-store/commit-events';
import { GetAllEvents } from '../event-store/get-all-events';
import { Logger } from '../logger';

export type DependenciesForCommands = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
  logger: Logger,
};

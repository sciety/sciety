import { EventStore } from '../event-store';
import { Logger } from '../logger';

export type DependenciesForCommands = EventStore & {
  logger: Logger,
};

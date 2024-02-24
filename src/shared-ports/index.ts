import { CommitEvents } from './commit-events';
import { GetAllEvents } from './get-all-events';
import { Logger } from './logger';
import { ExternalQueries } from '../third-parties';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';
export { Logger } from './logger';

export type SharedPorts = ExternalQueries & {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
  logger: Logger,
};

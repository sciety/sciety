import { CommitEvents } from './commit-events';
import { GetAllEvents } from './get-all-events';
import { ExternalQueries } from '../third-parties';

export { GetAllEvents } from './get-all-events';
export { CommitEvents } from './commit-events';

export type SharedPorts = ExternalQueries & {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

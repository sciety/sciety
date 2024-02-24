import { CommitEvents } from './commit-events.js';
import { GetAllEvents } from './get-all-events.js';
import { ExternalQueries } from '../third-parties/index.js';

export { GetAllEvents } from './get-all-events.js';
export { CommitEvents } from './commit-events.js';

export type SharedPorts = ExternalQueries & {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};
